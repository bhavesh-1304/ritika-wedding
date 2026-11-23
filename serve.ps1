$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $root) { $root = Get-Location }

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8000/')
try {
    $listener.Prefixes.Add('http://127.0.0.1:8000/')
} catch {}

$listener.Start()
Write-Host "=========================================================="
Write-Host " Marwadi Royal Wedding Invitation Server is Running!"
Write-Host " Local URL: http://localhost:8000"
Write-Host " IP URL:    http://127.0.0.1:8000"
Write-Host " Root:      $root"
Write-Host " Press Ctrl+C in this console to stop the server."
Write-Host "=========================================================="

$mimeMap = @{
    '.html' = 'text/html; charset=utf-8';
    '.css'  = 'text/css; charset=utf-8';
    '.js'   = 'application/javascript; charset=utf-8';
    '.png'  = 'image/png';
    '.jpg'  = 'image/jpeg';
    '.jpeg' = 'image/jpeg';
    '.svg'  = 'image/svg+xml';
    '.mp3'  = 'audio/mpeg';
    '.json' = 'application/json';
    '.ico'  = 'image/x-icon';
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath.TrimStart('/'))
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = 'index.html'
        }

        $localPath = Join-Path $root $urlPath
        if (-not (Test-Path $localPath) -or (Get-Item $localPath).PSIsContainer) {
            $localPath = Join-Path $root 'index.html'
        }

        if (Test-Path $localPath) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $mime = $mimeMap[$ext]
            if (-not $mime) { $mime = 'application/octet-stream' }

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.Headers.Add('Access-Control-Allow-Origin', '*')
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.OutputStream.Close()
    } catch {
        # Catch individual request exceptions (e.g. client disconnect) so server keeps running
    }
}
