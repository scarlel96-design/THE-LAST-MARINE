import {readFileSync} from 'node:fs';
import {encode,decode,m02Start} from '../src/m01/campaign-transfer.mjs';
const [mode,input]=process.argv.slice(2);
try {
 if(mode==='--decode'&&input){const state=decode(input);console.log(JSON.stringify({state,m02:m02Start(state)},null,2));}
 else if(mode==='--encode'&&input)console.log(encode(JSON.parse(readFileSync(input,'utf8'))));
 else {console.error('Usage: node campaign-code.mjs --decode CODE | --encode STATE_JSON');process.exitCode=2;}
}catch(error){console.error(error.message);process.exitCode=1;}
