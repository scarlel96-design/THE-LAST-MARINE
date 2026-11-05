"""Run declared offline scenarios. Record observations independently from input delivery."""
import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path
import re
import shutil
import time
from win32_host import WinHost, StopRun
from vision import panel_metrics, panel_matches

def stamp():
    return dt.datetime.now(dt.timezone.utc).isoformat()

def matches(text, expect, absent=()):
    compact = re.sub(r'\s+',' ',text).strip().casefold()
    return all(re.search(pattern,compact,re.I) is not None for pattern in expect) and not any(re.search(pattern,compact,re.I) for pattern in absent)

def validate(spec):
    if spec.get('schema') != 1 or spec.get('environment') != 'offline-local':
        raise ValueError('Only schema 1 offline-local scenarios are accepted')
    ids = set()
    for case in spec['cases']:
        if not re.fullmatch(r'[a-zA-Z0-9_-]{1,80}',case['id']):
            raise ValueError('Case id must be a simple filename component')
        if case['id'] in ids:
            raise ValueError('Duplicate case id')
        ids.add(case['id'])
        if case.get('status') in ('SKIP','NOT RUN'):
            continue
        if not case.get('steps'):
            raise ValueError('An executable case needs steps')
        for step in case['steps']:
            if step['op'] not in ('key','click','wait','capture'):
                raise ValueError('Unknown operation')
            if step['op']=='wait' and (not (step.get('expect') or step.get('visual')) or not 0 < step.get('timeout',10) <= 90):
                raise ValueError('Wait needs an assertion and a bounded timeout')
            if step['op']=='click' and (len(step['xy']) != 2 or not all(0 <= x <= 1 for x in step['xy'])):
                raise ValueError('Click coordinates must be normalized')
            if not .05 <= step.get('hold',.16) <= 1:
                raise ValueError('Input hold must be between 0.05 and 1 second')
        if not any(s['op']=='wait' for s in case['steps']):
            raise ValueError('Input delivery alone is not a functional assertion')

class Runner:
    def __init__(self, host, out):
        self.host, self.out = host, Path(out)
        self.out.mkdir(parents=True,exist_ok=False)
        self.events = []
        self.serial = 0
        self.retry_count = 0

    def event(self, **data):
        row = {'time':stamp(),**data}
        self.events.append(row)
        with (self.out/'events.jsonl').open('a',encoding='utf-8') as file:
            file.write(json.dumps(row,ensure_ascii=False)+'\n')

    def capture(self, case, ocr=False, rect=None, language='en-US'):
        self.serial += 1
        path = self.out/f'{self.serial:03d}-{case}.bmp'
        value = self.host.observe(path,rect,language) if ocr else self.host.capture(path)
        self.event(case=case,op='observation',file=path.name,ocr=value if ocr else None)
        return value

    def wait(self, case, step):
        started = time.monotonic()
        attempts = 0
        while True:
            self.host.guard()
            if step.get('visual'):
                self.capture(case)
                path=self.out/f'{self.serial:03d}-{case}.bmp'
                observed=panel_metrics(path,step['visual']['rect'])
                success=panel_matches(observed,step['visual'])
                self.event(case=case,op='visual_metrics',value=observed)
            else:
                observed = self.capture(case,True,step.get('rect',self.default_rect),step.get('language','ko-KR'))
                success=matches(observed['text'],step['expect'],step.get('absent',[]))
            attempts += 1
            if success:
                self.event(case=case,op='assertion',status='PASS',expect=step.get('expect',step.get('visual')),elapsed_s=time.monotonic()-started,observations=attempts)
                return
            if time.monotonic()-started >= step.get('timeout',10):
                raise StopRun('State assertion timed out: '+repr(step.get('expect',step.get('visual'))))
            self.host.delay(step.get('poll',.35))

    def run(self, spec):
        self.default_rect = spec.get('ocr_rect')
        started = time.perf_counter()
        result = {'schema':1,'scenario':spec['name'],'started_utc':stamp(),'cases':[],
                  'scope':'Actual visible states only. Input delivery is not functional PASS.',
                  'local_invocations':1,'ai_decisions_inside_run':0,'retries':0,
                  'game_pid':getattr(self.host,'pid',None)}
        snapshot=self.out/'source_snapshot'
        snapshot.mkdir()
        for name in ('runner.py','win32_host.py','ocr.ps1','vision.py'):
            shutil.copyfile(Path(__file__).with_name(name),snapshot/name)
        (snapshot/'scenario.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        stopped = False
        try:
            self.host.activate()
            self.host.start_monitor()
            for case in spec['cases']:
                row = {'id':case['id'],'started_utc':stamp()}
                tick = time.perf_counter()
                if case.get('status') in ('SKIP','NOT RUN'):
                    row.update(status=case['status'],reason=case['reason'])
                elif stopped:
                    row.update(status='NOT RUN',reason='Earlier required state failed')
                else:
                    try:
                        for step in case['steps']:
                            self.host.guard()
                            self.event(case=case['id'],op=step['op'],request=step)
                            if step['op']=='key':
                                self.host.key(step['key'],step.get('hold',.16))
                            elif step['op']=='click':
                                self.host.click(step['xy'],step.get('button','left'),step.get('hold',.16))
                            elif step['op']=='wait':
                                self.wait(case['id'],step)
                            else:
                                self.capture(case['id'])
                        row['status']='PASS'
                    except Exception as error:
                        row.update(status='FAIL',reason=str(error))
                        # Capture only the target while it remains foreground.
                        try:
                            self.capture(case['id']+'-failure')
                        except Exception as capture_error:
                            row['failure_capture_error']=str(capture_error)
                        stopped=True
                row.update(ended_utc=stamp(),elapsed_s=round(time.perf_counter()-tick,4))
                result['cases'].append(row)
                self.event(case=case['id'],op='case_result',**{k:v for k,v in row.items() if k!='id'})
        except Exception as error:
            result['run_error']=str(error)
            done={r['id'] for r in result['cases']}
            for case in spec['cases']:
                if case['id'] not in done:
                    result['cases'].append({'id':case['id'],'status':case.get('status','NOT RUN'),'reason':case.get('reason',str(error))})
        finally:
            self.host.close()
            result.update(ended_utc=stamp(),elapsed_s=round(time.perf_counter()-started,4),
                          captures=self.host.capture_count,inputs=self.host.input_count,
                          input_delivery_failures=sum('SendInput rejected' in r.get('reason','') for r in result['cases']),
                          timing=self.host.timing,
                          counts={s:sum(r['status']==s for r in result['cases']) for s in ('PASS','FAIL','SKIP','NOT RUN')})
            result['status']='FAIL' if result.get('run_error') or result['counts']['FAIL'] else ('PARTIAL' if result['counts']['NOT RUN'] or result['counts']['SKIP'] else 'PASS')
            (self.out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
            manifest={str(p.relative_to(self.out)):hashlib.sha256(p.read_bytes()).hexdigest() for p in self.out.rglob('*') if p.is_file()}
            (self.out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
        return result

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('scenario',type=Path)
    parser.add_argument('--pid',type=int)
    parser.add_argument('--out',type=Path)
    parser.add_argument('--local-offline',action='store_true')
    parser.add_argument('--validate',action='store_true')
    args=parser.parse_args()
    spec=json.loads(args.scenario.read_text(encoding='utf-8-sig'))
    validate(spec)
    if args.validate:
        print('SCENARIO VALID: '+spec['name'])
        return 0
    if not args.local_offline or not args.pid or not args.out:
        parser.error('Live execution needs --pid, --out, and --local-offline')
    try:
        host=WinHost(args.pid)
    except Exception as error:
        args.out.mkdir(parents=True,exist_ok=False)
        result={'status':'FAIL','started_utc':stamp(),'ended_utc':stamp(),'preflight_error':str(error),
                'cases':[{'id':case['id'],'status':case.get('status','NOT RUN'),'reason':case.get('reason','Game preflight failed')} for case in spec['cases']]}
        (args.out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(json.dumps(result,ensure_ascii=True))
        return 1
    result=Runner(host,args.out).run(spec)
    print(json.dumps({k:result[k] for k in ('status','counts','elapsed_s','captures','inputs')},ensure_ascii=False))
    return 1 if result['status']=='FAIL' else 0

if __name__=='__main__':
    raise SystemExit(main())
