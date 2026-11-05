"""Read captured pixels. Keep visual checks separate from gameplay claims."""
from pathlib import Path
import struct
import zlib

def bitmap(path):
    data=Path(path).read_bytes()
    if data[:2]!=b'BM': raise ValueError('Expected BMP')
    offset=struct.unpack_from('<I',data,10)[0]
    width,height=struct.unpack_from('<ii',data,18)
    if struct.unpack_from('<H',data,28)[0]!=32 or height>=0:
        raise ValueError('Expected top-down 32-bit capture')
    return width,-height,data[offset:]

def panel_metrics(path,rect):
    width,height,pixels=bitmap(path)
    x,y,rw,rh=[round(v*s) for v,s in zip(rect,[width,height,width,height])]
    count=blue=visible=0
    for row in range(y,min(height,y+rh),3):
        for col in range(x,min(width,x+rw),3):
            i=(row*width+col)*4
            b,g,r=pixels[i:i+3]
            count+=1
            blue+=b>30 and b>r*1.25 and b>g*1.15
            visible+=max(r,g,b)>8
    return {'blue_fraction':blue/max(1,count),'nonblack_fraction':visible/max(1,count)}

def panel_matches(metrics,rule):
    return metrics['nonblack_fraction']>=rule.get('nonblack_min',.8) and rule.get('blue_min',0)<=metrics['blue_fraction']<=rule.get('blue_max',1)

def png_copy(source,destination):
    width,height,pixels=bitmap(source)
    rgb=bytearray(width*height*3)
    rgb[0::3]=pixels[2::4];rgb[1::3]=pixels[1::4];rgb[2::3]=pixels[0::4]
    raw=b''.join(b'\0'+rgb[row*width*3:(row+1)*width*3] for row in range(height))
    def chunk(name,data):
        return struct.pack('>I',len(data))+name+data+struct.pack('>I',zlib.crc32(name+data))
    Path(destination).write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',width,height,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,6))+chunk(b'IEND',b''))
