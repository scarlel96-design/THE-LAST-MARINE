$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type -AssemblyName System.Drawing
$null = [Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]
$null = [Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]
$null = [Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]
$null = [Windows.Globalization.Language,Windows.Globalization,ContentType=WindowsRuntime]
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod
} | Select-Object -First 1
function Await($Operation, $Type) {
    $task = $asTask.MakeGenericMethod($Type).Invoke($null,@($Operation))
    $task.GetAwaiter().GetResult()
}
$engines = @{}
while ($line = [Console]::ReadLine()) {
    try {
        $request = $line | ConvertFrom-Json
        $language = if ($request.language) { $request.language } else { 'en-US' }
        if (-not $engines.ContainsKey($language)) {
            $engines[$language] = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage([Windows.Globalization.Language]::new($language))
        }
        $engine = $engines[$language]
        if (-not $engine) { throw "Requested OCR language is not installed: $language" }
        $path = $request.path
        $temporary = $null
        if ($request.rect) {
            $source = [Drawing.Bitmap]::new($path)
            try {
                $r = $request.rect
                $box = [Drawing.Rectangle]::new([int]($r[0]*$source.Width),[int]($r[1]*$source.Height),[int]($r[2]*$source.Width),[int]($r[3]*$source.Height))
                $crop = $source.Clone($box,$source.PixelFormat)
                $temporary = $path + '.crop.png'
                $large = [Drawing.Bitmap]::new($crop.Width*2,$crop.Height*2)
                $canvas = [Drawing.Graphics]::FromImage($large)
                $canvas.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
                $canvas.DrawImage($crop,0,0,$large.Width,$large.Height)
                $large.Save($temporary,[Drawing.Imaging.ImageFormat]::Png)
                $canvas.Dispose()
                $large.Dispose()
                $crop.Dispose()
                $path = $temporary
            } finally { $source.Dispose() }
        }
        $file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($path)) ([Windows.Storage.StorageFile])
        $stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
        try {
            $decoder = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
            $bitmap = Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
            try { $result = Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult]) }
            finally { $bitmap.Dispose() }
            $lines = @($result.Lines | ForEach-Object { $_.Text })
            [Console]::WriteLine((@{text=$result.Text; lines=$lines; language=$engine.RecognizerLanguage.LanguageTag} | ConvertTo-Json -Compress))
        } finally { $stream.Dispose() }
    } catch {
        [Console]::WriteLine((@{error=$_.Exception.Message} | ConvertTo-Json -Compress))
    }
}
