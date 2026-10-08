# Monta o deck a partir das partes desta pasta e roda node --check no script.
#   & .\fonte\montar.ps1                                  todas as cenas (pastas cenaNN) -> ..\index.html
#   & .\fonte\montar.ps1 -Cenas 02 -Destino C:\tmp\c2.html   build privado: só a cena 02, noutro arquivo
#   & .\fonte\montar.ps1 -Cenas 01,02 -Destino ...           várias cenas, na ordem dada
#   & .\fonte\montar.ps1 -Cenas _modelo -Destino ...         uma pasta qualquer de fonte\ (o modelo de cena)
# Ordem das partes: estilo.css, jogo.css, jogo-*.css, <cena>\*.css | som.js, motor.js, jogo-*.js, <cena>\*.js (alfabética).
# Os .js de uma cena são concatenados sem separação: juntos formam um bloco só, que termina em Deck.registrar({...}).
param([string[]]$Cenas, [string]$Destino)
$ErrorActionPreference = 'Stop'
$fonte = $PSScriptRoot
$saida = if ($Destino) { $Destino } else { Join-Path (Split-Path $fonte -Parent) 'index.html' }
$utf8  = New-Object System.Text.UTF8Encoding($false)
function Ler($caminho) { [System.IO.File]::ReadAllText($caminho, $utf8).TrimEnd() }
function Juntar($arquivos) { ($arquivos | ForEach-Object { Ler $_.FullName }) -join "`n`n" }
function PorNome($pasta, $filtro) { @(Get-ChildItem $pasta -File -Filter $filtro | Sort-Object { $_.Name } -Culture '') }

if ($Cenas) {
  $pastas = foreach ($c in $Cenas) {
    $nome = if ("$c" -match '^\d+$') { 'cena{0:D2}' -f [int]$c } else { "$c" }
    $p = Join-Path $fonte $nome
    if (-not (Test-Path $p -PathType Container)) { throw "Pasta de cena nao encontrada: $p" }
    Get-Item $p
  }
} else {
  $pastas = @(Get-ChildItem $fonte -Directory | Where-Object { $_.Name -match '^cena\d+$' } | Sort-Object Name)
}
$pastas = @($pastas)
if (-not $pastas.Count) { throw 'Nenhuma cena para montar.' }

$css     = @(Get-Item (Join-Path $fonte 'estilo.css'), (Join-Path $fonte 'jogo.css')) + (PorNome $fonte 'jogo-*.css') + @($pastas | ForEach-Object { PorNome $_.FullName '*.css' })
$jogo    = PorNome $fonte 'jogo-*.js'
$cenasJs = ($pastas | ForEach-Object { ((PorNome $_.FullName '*.js') | ForEach-Object { [System.IO.File]::ReadAllText($_.FullName, $utf8) }) -join '' }) -join "`n`n"

$fonteB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $fonte 'ativos\public-sans-latin.woff2')))
$logoB64  = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes((Join-Path $fonte 'ativos\logo-marinho-transparente.png')))

$html = Ler (Join-Path $fonte 'casca.html')
$html = $html.Replace('__CSS__',   (Juntar $css))
$html = $html.Replace('__SOM__',   (Ler (Join-Path $fonte 'som.js')))
$html = $html.Replace('__MOTOR__', (Ler (Join-Path $fonte 'motor.js')))
$html = $html.Replace('__JOGO__',  (Juntar $jogo))
$html = $html.Replace('__CENAS__', $cenasJs.TrimEnd())
$html = $html.Replace('__FONTE__', $fonteB64).Replace('__LOGO__', $logoB64)
$dir = Split-Path $saida -Parent
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
[System.IO.File]::WriteAllText($saida, $html + "`n", $utf8)

# node --check no script extraído do arquivo final (arquivo temporário, apagado em seguida)
$m   = [regex]::Match($html, '(?s)<script>(.*?)</script>')
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("deck-animado-" + [guid]::NewGuid().ToString('N') + '.js')
[System.IO.File]::WriteAllText($tmp, $m.Groups[1].Value, $utf8)
$linhas = ($m.Groups[1].Value -split "`n").Count
try { node --check $tmp; $ok = ($LASTEXITCODE -eq 0) } finally { Remove-Item $tmp -Force -ErrorAction SilentlyContinue }
"{0}  {1:N0} bytes  |  cenas: {2}  |  script: {3} linhas, node --check {4}" -f $saida, (Get-Item $saida).Length, (($pastas | ForEach-Object Name) -join ', '), $linhas, $(if ($ok) { 'OK' } else { 'FALHOU' })
if (-not $ok) { exit 1 }
