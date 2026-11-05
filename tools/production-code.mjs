import {resolveM02,decodeM03} from '../src/m02/transfer.mjs';

try {
 const [command,code,...extra]=process.argv.slice(2);
 if(extra.length)throw Error('Pass one code at most');
 const result=command==='m02-start'?resolveM02(code):command==='m03-start'?decodeM03(code):null;
 if(result===null)throw Error('Usage: production-code.mjs m02-start [CODE] | m03-start CODE');
 console.log(JSON.stringify(result,null,2));
} catch(error) {
 console.error(error.message);process.exitCode=1;
}
