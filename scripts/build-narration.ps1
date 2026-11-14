# Generates the narration audio of the sound stories with the Windows voices
# (es: Microsoft Helena, en: Microsoft Zira) into public/narration/<lang>/<id>.mp3
#
# Usage (from the project folder):
#   powershell -ExecutionPolicy Bypass -File scripts/build-narration.ps1 -Ffmpeg C:\path\to\ffmpeg.exe
#
# To use a real human voice instead, record each line and save it with the same
# file name (for example public/narration/es/forest-intro-1.mp3).

param(
  [Parameter(Mandatory = $true)][string]$Ffmpeg,
  [string]$Only = ''  # optional: only regenerate ids that start with this prefix
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$manifest = node (Join-Path $PSScriptRoot 'narration-manifest.mjs') | ConvertFrom-Json
$voices = @{ es = 'Microsoft Helena Desktop'; en = 'Microsoft Zira Desktop' }
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) 'terrabeats-narration'
New-Item -ItemType Directory -Force $tmp | Out-Null

foreach ($line in $manifest) {
  if ($Only -and -not $line.id.StartsWith($Only)) { continue }
  $outDir = Join-Path $root "public/narration/$($line.lang)"
  New-Item -ItemType Directory -Force $outDir | Out-Null
  $wav = Join-Path $tmp "$($line.lang)-$($line.id).wav"
  $mp3 = Join-Path $outDir "$($line.id).mp3"

  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice($voices[$line.lang])
  $synth.SetOutputToWaveFile($wav)
  # SSML: slightly slower delivery and a short pause after each sentence sound
  # less robotic than the default reading.
  $culture = @{ es = 'es-ES'; en = 'en-US' }[$line.lang]
  $body = [System.Security.SecurityElement]::Escape($line.text) -replace '([\.\?!:]) ', '$1<break time="350ms"/> '
  $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='$culture'><prosody rate='-12%' pitch='-2%'>$body</prosody></speak>"
  $synth.SpeakSsml($ssml)
  $synth.Dispose()

  & $Ffmpeg -hide_banner -loglevel error -y -i $wav -ac 1 -ar 22050 -b:a 48k $mp3
  Write-Output "$($line.lang)/$($line.id).mp3"
}
