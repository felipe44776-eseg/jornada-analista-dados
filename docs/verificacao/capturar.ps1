# Captura o estado final de cada passo pelo link direto (?cena=ID&passo=P&parado=1), janela 1280x720.
#   & .\verificacao\capturar.ps1 -Saida <pasta>                              cena 01 do ..\index.html, todos os passos
#   & .\verificacao\capturar.ps1 -Saida <pasta> -Deck C:\tmp\c2.html -Cena 02    um build privado, outra cena
#   & .\verificacao\capturar.ps1 -Saida <pasta> -Passos 3,4                      só alguns passos
#   & .\verificacao\capturar.ps1 -Saida <pasta> -Oficina                         só as folhas de oficina (?oficina=1, ?oficina=2, ?heroi=1)
# Sem -Passos, o número de passos vem de fonte\cenaNN\esperado.json ("passos").
# Cada chamada do navegador tem teto de 45 s; se pendurar, o processo é morto.
param(
  [string]$Saida = (Join-Path ([System.IO.Path]::GetTempPath()) 'deck-animado-verificacao'),
  [string]$Deck,
  [string]$Cena = '01',
  [int[]]$Passos,
  [switch]$Oficina
)
$ErrorActionPreference = 'Stop'
$raiz  = Split-Path $PSScriptRoot -Parent
$index = (Resolve-Path $(if ($Deck) { $Deck } else { Join-Path $raiz 'index.html' })).Path
$url   = 'file:///' + ($index -replace '\\', '/' -replace ' ', '%20')
$nav   = @('C:\Program Files\Google\Chrome\Application\chrome.exe', 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', 'C:\Program Files\Microsoft\Edge\Application\msedge.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $nav) { throw 'Chrome ou Edge nao encontrado.' }
New-Item -ItemType Directory -Force $Saida | Out-Null
$perfil = Join-Path $Saida '_perfil-captura'
if ("$Cena" -match '^\d+$') { $Cena = '{0:D2}' -f [int]$Cena }

function Fotografar([string]$consulta, [string]$nome) {
  $png = Join-Path $Saida "$nome.png"; $log = Join-Path $Saida "$nome.log"
  if (Test-Path $png) { Remove-Item $png -Force }
  $a = @('--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--mute-audio',
         "--user-data-dir=$perfil", '--window-size=1280,720', '--force-device-scale-factor=1', '--virtual-time-budget=4000',
         '--enable-logging=stderr', '--v=0', "--screenshot=$png", "$url`?$consulta")
  $proc = Start-Process -FilePath $nav -ArgumentList $a -PassThru -WindowStyle Hidden -RedirectStandardError $log
  if (-not $proc.WaitForExit(45000)) { try { $proc.Kill($true) } catch {}; "$nome`: PENDUROU, processo morto"; return }
  $erros = @(Select-String -Path $log -Pattern 'CONSOLE|Uncaught|SyntaxError|TypeError|ReferenceError' -ErrorAction SilentlyContinue | ForEach-Object { $_.Line })
  $tam = if (Test-Path $png) { (Get-Item $png).Length } else { 0 }
  "$nome`: png=$tam bytes, linhas de erro no log=$($erros.Count)"
  $erros | Select-Object -First 5
  Remove-Item $log -Force -ErrorAction SilentlyContinue
}

if ($Oficina) {
  Fotografar 'oficina=1' 'oficina-1-personagens'
  Fotografar 'oficina=2' 'oficina-2-pecas'
  Fotografar 'oficina=3' 'oficina-3-comuns'
  Fotografar 'oficina=4' 'oficina-4-noite'
  Fotografar 'heroi=1' 'oficina-heroi'
} else {
  if (-not $Passos) {
    $esp = Join-Path $raiz "fonte\cena$Cena\esperado.json"
    if (-not (Test-Path $esp)) { throw "Sem -Passos e sem $esp para dizer quantos passos a cena tem." }
    $n = (Get-Content $esp -Raw | ConvertFrom-Json).passos
    $Passos = 0..($n - 1)
  }
  foreach ($p in $Passos) { Fotografar "cena=$Cena&passo=$p&parado=1" ("passo{0}" -f $p) }
}
Remove-Item $perfil -Recurse -Force -ErrorAction SilentlyContinue
"saida: $Saida"
