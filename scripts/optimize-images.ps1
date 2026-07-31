Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Pratheesh os\public\assets\pratheesh4k2.jpeg"
if (-Not (Test-Path $srcPath)) {
    Write-Host "Source image not found"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$origW = $srcImg.Width
$origH = $srcImg.Height
Write-Host "Original dimensions: $origW x $origH"

function Save-ResizedImage($targetWidth, $outPath, $quality) {
    $ratio = $targetWidth / $origW
    $targetHeight = [int]($origH * $ratio)
    
    $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $g.DrawImage($srcImg, 0, 0, $targetWidth, $targetHeight)
    $g.Dispose()

    # Get JPEG Codec
    $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
    $jpegCodec = $null
    foreach ($c in $codecs) {
        if ($c.MimeType -eq "image/jpeg") {
            $jpegCodec = $c
            break
        }
    }

    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)

    $bmp.Save($outPath, $jpegCodec, $encoderParams)
    $bmp.Dispose()
    
    $fileItem = Get-Item $outPath
    $kb = [math]::Round($fileItem.Length / 1KB, 2)
    Write-Host "Saved $outPath - Size: ${kb} KB ($targetWidth x $targetHeight)"
}

# Generate 300px (Mobile portrait avatar), 480px (Mobile hero), 800px (Tablet), 1200px (Desktop)
Save-ResizedImage 480 "d:\Pratheesh os\public\assets\pratheesh-mobile.jpg" 82
Save-ResizedImage 800 "d:\Pratheesh os\public\assets\pratheesh-tablet.jpg" 85
Save-ResizedImage 1200 "d:\Pratheesh os\public\assets\pratheesh-desktop.jpg" 88

$srcImg.Dispose()
Write-Host "Image optimization complete!"
