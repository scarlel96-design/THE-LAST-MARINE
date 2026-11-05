import copy
import json
from pathlib import Path
import tempfile
import unittest
from runner import Runner, validate, matches
from win32_host import StopRun
from vision import panel_matches,panel_metrics
import struct

SPEC={'schema':1,'environment':'offline-local','name':'fixture','cases':[{'id':'one','steps':[{'op':'key','key':'Q'},{'op':'wait','expect':['active'],'timeout':.01,'poll':.001}]}]}

class Fake:
    def __init__(self,text='active',collision=False,delivery=False):
        self.text=text; self.collision=collision; self.delivery=delivery
        self.capture_count=0; self.input_count=0; self.timing={}; self.closed=False
    def activate(self): pass
    def start_monitor(self): pass
    def guard(self):
        if self.collision: raise StopRun('External keyboard input detected')
    def key(self,*args):
        if self.delivery: raise StopRun('SendInput rejected: 5')
        self.input_count+=1
    def capture(self,path):
        self.capture_count+=1; Path(path).write_bytes(b'fixture')
    def observe(self,path,rect,language):
        self.capture(path); return {'text':self.text}
    def delay(self,seconds): pass
    def close(self): self.closed=True

class Tests(unittest.TestCase):
    def execute(self,host,spec=None):
        with tempfile.TemporaryDirectory() as temp:
            out=Path(temp)/'run'
            result=Runner(host,out).run(spec or copy.deepcopy(SPEC))
            self.assertEqual(json.loads((out/'result.json').read_text())['status'],result['status'])
            self.assertTrue((out/'manifest.json').exists())
            self.assertTrue(host.closed)
            return result
    def test_actual_assertion_required(self):
        spec=copy.deepcopy(SPEC);spec['cases'][0]['steps'].pop()
        with self.assertRaises(ValueError):validate(spec)
    def test_online_rejected(self):
        spec=copy.deepcopy(SPEC);spec['environment']='online'
        with self.assertRaises(ValueError):validate(spec)
    def test_duplicate_id_rejected(self):
        spec=copy.deepcopy(SPEC);spec['cases']*=2
        with self.assertRaises(ValueError):validate(spec)
    def test_unbounded_wait_rejected(self):
        spec=copy.deepcopy(SPEC);spec['cases'][0]['steps'][1]['timeout']=1000
        with self.assertRaises(ValueError):validate(spec)
    def test_observed_pass(self): self.assertEqual(self.execute(Fake())['counts']['PASS'],1)
    def test_no_false_pass_on_input(self): self.assertEqual(self.execute(Fake('unchanged'))['counts']['FAIL'],1)
    def test_collision_stops_before_input(self):
        host=Fake(collision=True);result=self.execute(host)
        self.assertEqual(host.input_count,0);self.assertEqual(result['counts']['FAIL'],1)
    def test_delivery_failure(self): self.assertEqual(self.execute(Fake(delivery=True))['input_delivery_failures'],1)
    def test_failure_stops_remaining_cases(self):
        spec=copy.deepcopy(SPEC);spec['cases'].append({'id':'later','steps':SPEC['cases'][0]['steps']})
        result=self.execute(Fake('unchanged'),spec)
        self.assertEqual([r['status'] for r in result['cases']],['FAIL','NOT RUN'])
    def test_skip_is_explicit(self):
        spec=copy.deepcopy(SPEC);spec['cases'].append({'id':'E','status':'SKIP','reason':'Not implemented'})
        self.assertEqual(self.execute(Fake(),spec)['counts']['SKIP'],1)
    def test_matching_ignores_spacing_case(self): self.assertTrue(matches('Q  ACTIVE',['q active']))
    def test_absent_state_rejected(self): self.assertFalse(matches('3 menu',['3'],['menu']))
    def test_scenarios_validate(self):
        for file in Path(__file__).parents[1].joinpath('scenarios').glob('*.json'):
            validate(json.loads(file.read_text(encoding='utf-8')))
    def test_path_escape_rejected(self):
        spec=copy.deepcopy(SPEC);spec['cases'][0]['id']='../escape'
        with self.assertRaises(ValueError):validate(spec)
    def test_excessive_key_hold_rejected(self):
        spec=copy.deepcopy(SPEC);spec['cases'][0]['steps'][0]['hold']=10
        with self.assertRaises(ValueError):validate(spec)
    def test_unknown_mouse_button_rejected(self):
        spec=copy.deepcopy(SPEC);spec['cases'][0]['steps'][0]={'op':'click','xy':[.5,.5],'button':'unknown'}
        with self.assertRaises(ValueError):validate(spec)
    def test_visual_rectangle_escape_rejected(self):
        spec=copy.deepcopy(SPEC);spec['cases'][0]['steps'][1]={'op':'wait','visual':{'rect':[.9,.5,.5,.5]}}
        with self.assertRaises(ValueError):validate(spec)
    def test_black_capture_cannot_match_closed_menu(self):
        self.assertFalse(panel_matches({'blue_fraction':0,'nonblack_fraction':0},{'blue_max':.03}))
    def test_blue_panel_matches_only_open(self):
        value={'blue_fraction':.95,'nonblack_fraction':1}
        self.assertTrue(panel_matches(value,{'blue_min':.8}))
        self.assertFalse(panel_matches(value,{'blue_max':.03}))
    def test_bitmap_color_measurement(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'blue.bmp'
            info=struct.pack('<IiiHHIIiiII',40,3,-3,1,32,0,36,0,0,0,0)
            p.write_bytes(struct.pack('<2sIHHI',b'BM',90,0,0,54)+info+bytes([100,20,20,0])*9)
            self.assertEqual(panel_metrics(p,[0,0,1,1]),{'blue_fraction':1,'nonblack_fraction':1})

if __name__=='__main__': unittest.main()
