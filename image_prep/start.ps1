<#
    This script prepares images by generating WebP thumbnails, full-size images, and post images.
    It expects an "Originals" directory containing the source images.
    The generated images are stored in the "WebP/Thumbnails", "WebP/FullSize", and "WebP/Posts" directories.

    Make sure ffmpeg is installed and available in the system's PATH.

    Usage:
        .\start.ps1
#>

$OriginalsPath = Join-Path -Path $PSScriptRoot -ChildPath "Originals"
$ThumbnailsPath = Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath "WebP") -ChildPath "Thumbnails"
$FullSizePath = Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath "WebP") -ChildPath "FullSize"
$PostsImgs = Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath "WebP") -ChildPath "Posts"

if (-not (Test-Path -Path $OriginalsPath)) {
    Write-Error "Originals path does not exist: $OriginalsPath"
    exit
}

$Originals = Get-ChildItem -Path $OriginalsPath -File

if (-not (Test-Path -Path $ThumbnailsPath)) {
    New-Item -ItemType Directory -Path $ThumbnailsPath | Out-Null
}

if (-not (Test-Path -Path $FullSizePath)) {
    New-Item -ItemType Directory -Path $FullSizePath | Out-Null
}

if (-not (Test-Path -Path $PostsImgs)) {
    New-Item -ItemType Directory -Path $PostsImgs | Out-Null
}

foreach ($Original in $Originals) {
    $OriginalFileName = [System.IO.Path]::GetFileNameWithoutExtension($Original.FullName)
    $OriginalFileName = $OriginalFileName -replace ' ', '_'
    $OriginalFileName = $OriginalFileName.ToLower()
    $WebPThumbnail = "$OriginalFileName`_thumbnail.webp"
    $WebPPosts = "$OriginalFileName`_posts.webp"
    $WebPFullSize = "$OriginalFileName`_fullsize.webp"
    $Thumbnail = Join-Path -Path $ThumbnailsPath -ChildPath ([System.IO.Path]::GetFileName($WebPThumbnail))
    if (-not (Test-Path -Path $Thumbnail)) {
        
        try {
            ffmpeg -i $Original.FullName -vf "scale=800:-1" -quality 85 $Thumbnail
        } catch {
            Write-Error "Failed to generate thumbnail for $($Original.FullName): $_"
        }
    }

    $FullSize = Join-Path -Path $FullSizePath -ChildPath ([System.IO.Path]::GetFileName($WebPFullSize))
    if (-not (Test-Path -Path $FullSize)) {
        try {
            ffmpeg -i $Original.FullName $FullSize
        } catch {
            Write-Error "Failed to generate full-size WebP for $($Original.FullName): $($_)"
        }
    }

    $PostImg = Join-Path -Path $PostsImgs -ChildPath ([System.IO.Path]::GetFileName($WebPPosts))
    if (-not (Test-Path -Path $PostImg)) {
        try {
            ffmpeg -i $Original.FullName -vf "scale=800:-1" -quality 85 $PostImg
        } catch {
            Write-Error "Failed to generate post image for $($Original.FullName): $($_)"
        }
    }
}