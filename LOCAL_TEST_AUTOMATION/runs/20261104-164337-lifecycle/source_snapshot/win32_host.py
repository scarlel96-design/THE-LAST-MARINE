"""Use documented Windows input and capture APIs. Do not access game memory."""
import ctypes as c
from ctypes import wintypes as w
from pathlib import Path
import hashlib
import json
import os
import struct
import subprocess
import threading
import time

EXE = r"C:\Program Files (x86)\StarCraft\x86_64\StarCraft.exe"
EXE_SHA = "ce3ab05dc9a6aa35418947e5d95e19651ad6fbcd5e2c1856cd729c5b7c31281c"
TAG = 0x544C4D

class StopRun(RuntimeError):
    pass

class WinHost:
    def __init__(self, pid):
        if os.name != 'nt':
            raise StopRun('Windows is required')
        self.u = c.WinDLL('user32', use_last_error=True)
        self.k = c.WinDLL('kernel32', use_last_error=True)
        self.g = c.WinDLL('gdi32', use_last_error=True)
        self.u.SetProcessDpiAwarenessContext(c.c_void_p(-4))
        self.pid = pid
        self.cancelled = threading.Event()
        self.cancel_reason = ''
        self.ocr_process = None
        self.capture_count = 0
        self.input_count = 0
        self.timing = {'capture_s': 0, 'ocr_s': 0, 'input_s': 0}
        self._declare()
        self.hwnd = self.find_window()
        self.verify_process()

    def _declare(self):
        u, k, g = self.u, self.k, self.g
        k.OpenProcess.argtypes = [w.DWORD,w.BOOL,w.DWORD]
        k.OpenProcess.restype = w.HANDLE
        k.QueryFullProcessImageNameW.argtypes = [w.HANDLE,w.DWORD,w.LPWSTR,c.POINTER(w.DWORD)]
        k.CloseHandle.argtypes = [w.HANDLE]
        u.GetForegroundWindow.restype = w.HWND
        u.IsWindow.argtypes = [w.HWND]
        u.GetWindowThreadProcessId.argtypes = [w.HWND,c.POINTER(w.DWORD)]
        u.GetClientRect.argtypes = [w.HWND,c.POINTER(w.RECT)]
        u.ClientToScreen.argtypes = [w.HWND,c.POINTER(w.POINT)]
        u.SetForegroundWindow.argtypes = [w.HWND]
        u.WindowFromPoint.argtypes = [w.POINT]
        u.WindowFromPoint.restype = w.HWND
        u.GetAncestor.argtypes = [w.HWND,w.UINT]
        u.GetAncestor.restype = w.HWND
        u.ShowWindow.argtypes = [w.HWND,c.c_int]
        u.GetDC.argtypes = [w.HWND]
        u.GetDC.restype = w.HDC
        u.ReleaseDC.argtypes = [w.HWND,w.HDC]
        g.CreateCompatibleDC.argtypes = [w.HDC]
        g.CreateCompatibleDC.restype = w.HDC
        g.CreateCompatibleBitmap.argtypes = [w.HDC,c.c_int,c.c_int]
        g.CreateCompatibleBitmap.restype = w.HBITMAP
        g.SelectObject.argtypes = [w.HDC,w.HGDIOBJ]
        g.SelectObject.restype = w.HGDIOBJ
        g.BitBlt.argtypes = [w.HDC,c.c_int,c.c_int,c.c_int,c.c_int,w.HDC,c.c_int,c.c_int,w.DWORD]
        g.GetDIBits.argtypes = [w.HDC,w.HBITMAP,w.UINT,w.UINT,c.c_void_p,c.c_void_p,w.UINT]
        g.DeleteObject.argtypes = [w.HGDIOBJ]
        g.DeleteDC.argtypes = [w.HDC]
        class MI(c.Structure):
            _fields_ = [('dx',w.LONG),('dy',w.LONG),('mouseData',w.DWORD),('dwFlags',w.DWORD),('time',w.DWORD),('dwExtraInfo',c.c_size_t)]
        class KI(c.Structure):
            _fields_ = [('wVk',w.WORD),('wScan',w.WORD),('dwFlags',w.DWORD),('time',w.DWORD),('dwExtraInfo',c.c_size_t)]
        class IU(c.Union):
            _fields_ = [('mi',MI),('ki',KI)]
        class INPUT(c.Structure):
            _anonymous_ = ('data',)
            _fields_ = [('type',w.DWORD),('data',IU)]
        self.INPUT, self.MI, self.KI = INPUT, MI, KI
        u.SendInput.argtypes = [w.UINT,c.POINTER(INPUT),c.c_int]
        u.SendInput.restype = w.UINT

    def find_window(self):
        found = []
        callback_type = c.WINFUNCTYPE(w.BOOL,w.HWND,w.LPARAM)
        def visit(hwnd, _):
            observed = w.DWORD()
            self.u.GetWindowThreadProcessId(hwnd,c.byref(observed))
            if observed.value == self.pid and self.u.IsWindowVisible(hwnd):
                found.append(hwnd)
            return True
        callback = callback_type(visit)
        self.u.EnumWindows(callback,0)
        if len(found) != 1:
            raise StopRun(f'Expected one visible game window; found {len(found)}')
        return found[0]

    def verify_process(self):
        handle = self.k.OpenProcess(0x1000,False,self.pid)
        if not handle:
            raise StopRun('Game process is missing or unreadable')
        try:
            name = c.create_unicode_buffer(32768)
            size = w.DWORD(len(name))
            if not self.k.QueryFullProcessImageNameW(handle,0,name,c.byref(size)):
                raise StopRun('Game executable path read failed')
            if os.path.normcase(name.value) != os.path.normcase(EXE):
                raise StopRun('Game executable path differs')
        finally:
            self.k.CloseHandle(handle)
        if hashlib.sha256(Path(EXE).read_bytes()).hexdigest() != EXE_SHA:
            raise StopRun('Game executable hash differs')

    def activate(self):
        self.u.ShowWindow(self.hwnd,9)
        self.u.SetForegroundWindow(self.hwnd)
        deadline = time.monotonic()+3
        while self.u.GetForegroundWindow() != self.hwnd:
            if time.monotonic() >= deadline:
                raise StopRun('Game activation failed')
            time.sleep(.05)
        self.guard()

    def guard(self):
        if self.cancelled.is_set():
            raise StopRun(self.cancel_reason or 'Physical input detected')
        observed = w.DWORD()
        self.u.GetWindowThreadProcessId(self.hwnd,c.byref(observed))
        if not self.u.IsWindow(self.hwnd) or observed.value != self.pid:
            raise StopRun('Game process or window changed')
        if self.u.GetForegroundWindow() != self.hwnd:
            raise StopRun('Game lost foreground focus')

    def start_monitor(self):
        ready = threading.Event()
        def monitor():
            u = c.WinDLL('user32',use_last_error=True)
            callback_type = c.WINFUNCTYPE(c.c_ssize_t,c.c_int,w.WPARAM,w.LPARAM)
            u.CallNextHookEx.argtypes = [w.HHOOK,c.c_int,w.WPARAM,w.LPARAM]
            u.CallNextHookEx.restype = c.c_ssize_t
            u.SetWindowsHookExW.argtypes = [c.c_int,callback_type,w.HINSTANCE,w.DWORD]
            u.SetWindowsHookExW.restype = w.HHOOK
            u.UnhookWindowsHookEx.argtypes = [w.HHOOK]
            class KB(c.Structure):
                _fields_ = [('vk',w.DWORD),('scan',w.DWORD),('flags',w.DWORD),('time',w.DWORD),('extra',c.c_size_t)]
            class MS(c.Structure):
                _fields_ = [('pt',w.POINT),('data',w.DWORD),('flags',w.DWORD),('time',w.DWORD),('extra',c.c_size_t)]
            def kb(code,wp,lp):
                if code >= 0:
                    event = c.cast(lp,c.POINTER(KB)).contents
                    if event.extra != TAG:
                        self.cancel_reason = 'External keyboard input detected'
                        self.cancelled.set()
                return u.CallNextHookEx(None,code,wp,lp)
            def mouse(code,wp,lp):
                if code >= 0:
                    event = c.cast(lp,c.POINTER(MS)).contents
                    if event.extra != TAG:
                        self.cancel_reason = 'External mouse input detected'
                        self.cancelled.set()
                return u.CallNextHookEx(None,code,wp,lp)
            callbacks = [callback_type(kb),callback_type(mouse)]
            hooks = [u.SetWindowsHookExW(13,callbacks[0],None,0),u.SetWindowsHookExW(14,callbacks[1],None,0)]
            if not all(hooks):
                self.cancel_reason = 'Input collision monitor failed'
                self.cancelled.set()
            ready.set()
            try:
                msg = w.MSG()
                while not getattr(self,'monitor_done',False):
                    while u.PeekMessageW(c.byref(msg),None,0,0,1):
                        u.TranslateMessage(c.byref(msg))
                        u.DispatchMessageW(c.byref(msg))
                    time.sleep(.01)
            finally:
                for hook in hooks:
                    if hook:
                        u.UnhookWindowsHookEx(hook)
        self.monitor_thread = threading.Thread(target=monitor,daemon=True)
        self.monitor_thread.start()
        if not ready.wait(3):
            raise StopRun('Input monitor did not initialize')
        self.guard()

    def delay(self, seconds):
        deadline = time.monotonic()+seconds
        while time.monotonic()<deadline:
            self.guard()
            time.sleep(min(.02,max(0,deadline-time.monotonic())))

    def _send(self, event):
        self.guard()
        if self.u.SendInput(1,c.byref(event),c.sizeof(event)) != 1:
            raise StopRun(f'SendInput rejected: {c.get_last_error()}')

    def key(self, key, hold=.16):
        keys = {'ESC':27,'ENTER':13,'F7':118,'F8':119,'F9':120,'F10':121}
        vk = keys.get(key.upper(),ord(key.upper()) if len(key)==1 else 0)
        if not vk:
            raise StopRun(f'Unsupported key {key}')
        scan = self.u.MapVirtualKeyW(vk,0)
        started = time.perf_counter()
        down = self.INPUT(type=1,ki=self.KI(0,scan,8,0,TAG))
        up = self.INPUT(type=1,ki=self.KI(0,scan,10,0,TAG))
        self._send(down)
        try:
            self.delay(hold)
        finally:
            # Always release a held key, including after focus loss.
            self.u.SendInput(1,c.byref(up),c.sizeof(up))
        self.input_count += 1
        self.timing['input_s'] += time.perf_counter()-started

    def dimensions(self):
        rect = w.RECT()
        if not self.u.GetClientRect(self.hwnd,c.byref(rect)):
            raise StopRun('Client rectangle read failed')
        return rect.right,rect.bottom

    def click(self, xy, button='left', hold=.16, relative=False):
        width,height = self.dimensions()
        pt = w.POINT(round(xy[0]*width),round(xy[1]*height))
        self.u.ClientToScreen(self.hwnd,c.byref(pt))
        hit = self.u.WindowFromPoint(pt)
        if self.u.GetAncestor(hit,2) != self.hwnd:
            hit_pid = w.DWORD()
            self.u.GetWindowThreadProcessId(hit,c.byref(hit_pid))
            raise StopRun(f'Pointer target is another window: hwnd={hit}, pid={hit_pid.value}')
        left,top = self.u.GetSystemMetrics(76),self.u.GetSystemMetrics(77)
        sw,sh = self.u.GetSystemMetrics(78),self.u.GetSystemMetrics(79)
        move = self.INPUT(type=0,mi=self.MI(round((pt.x-left)*65535/(sw-1)),round((pt.y-top)*65535/(sh-1)),0,0xC001,0,TAG))
        if relative:
            current = w.POINT()
            self.u.GetCursorPos(c.byref(current))
            move = self.INPUT(type=0,mi=self.MI(pt.x-current.x,pt.y-current.y,0,0x2001,0,TAG))
        flags = (2,4) if button=='left' else (8,16)
        down = self.INPUT(type=0,mi=self.MI(0,0,0,flags[0],0,TAG))
        up = self.INPUT(type=0,mi=self.MI(0,0,0,flags[1],0,TAG))
        started = time.perf_counter()
        self._send(move)
        self.delay(.04)
        if button == 'none':
            self.input_count += 1
            self.timing['input_s'] += time.perf_counter()-started
            return
        self._send(down)
        try:
            self.delay(hold)
        finally:
            self.u.SendInput(1,c.byref(up),c.sizeof(up))
        self.input_count += 1
        self.timing['input_s'] += time.perf_counter()-started

    def capture(self, path):
        self.guard()
        started = time.perf_counter()
        width,height = self.dimensions()
        origin = w.POINT(0,0)
        self.u.ClientToScreen(self.hwnd,c.byref(origin))
        dc = self.u.GetDC(None)
        mem = self.g.CreateCompatibleDC(dc)
        bitmap = self.g.CreateCompatibleBitmap(dc,width,height)
        old = self.g.SelectObject(mem,bitmap)
        try:
            if not self.g.BitBlt(mem,0,0,width,height,dc,origin.x,origin.y,0x40CC0020):
                raise StopRun('Game capture failed')
            self.g.SelectObject(mem,old)
            info = struct.pack('<IiiHHIIiiII',40,width,-height,1,32,0,width*height*4,0,0,0,0)
            info_buf = c.create_string_buffer(info)
            pixels = c.create_string_buffer(width*height*4)
            if self.g.GetDIBits(mem,bitmap,0,height,pixels,info_buf,0) != height:
                raise StopRun('Game pixels read failed')
            Path(path).write_bytes(struct.pack('<2sIHHI',b'BM',54+len(pixels),0,0,54)+info+pixels.raw)
        finally:
            self.g.DeleteObject(bitmap)
            self.g.DeleteDC(mem)
            self.u.ReleaseDC(None,dc)
        self.capture_count += 1
        self.timing['capture_s'] += time.perf_counter()-started
        return width,height

    def observe(self, path, rect=None, language='ko-KR'):
        self.capture(path)
        if self.ocr_process is None:
            self.ocr_process = subprocess.Popen(['powershell.exe','-NoProfile','-File',str(Path(__file__).with_name('ocr.ps1'))],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8',creationflags=0x08000000)
        started = time.perf_counter()
        self.ocr_process.stdin.write(json.dumps({'path':str(Path(path).resolve()),'rect':rect,'language':language})+'\n')
        self.ocr_process.stdin.flush()
        # Bound the helper response. A stalled OCR process must not stall input cleanup.
        result = []
        reader = threading.Thread(target=lambda:result.append(self.ocr_process.stdout.readline()),daemon=True)
        reader.start()
        deadline = time.monotonic()+15
        while reader.is_alive():
            self.delay(.02)
            if time.monotonic()>deadline:
                raise StopRun('OCR response timed out')
        self.timing['ocr_s'] += time.perf_counter()-started
        if not result or not result[0]:
            raise StopRun('OCR helper exited')
        value = json.loads(result[0])
        if value.get('error'):
            raise StopRun('OCR: '+value['error'])
        return value

    def close(self):
        self.monitor_done = True
        if getattr(self,'monitor_thread',None):
            self.monitor_thread.join(1)
        if self.ocr_process:
            self.ocr_process.kill()
            self.ocr_process.communicate(timeout=3)
