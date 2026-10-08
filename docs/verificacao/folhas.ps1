# Monta folhas de contato (uma por passo) com os quadros real-pN-tTTTT.png que o conferir.mjs gravou.
# Uso:  pwsh -Command "& verificacao\folhas.ps1 -Saida <pasta> [-Passos 3,4] [-Colunas 2]"
param(
  [string]$Saida = (Join-Path ([System.IO.Path]::GetTempPath()) 'deck-animado-verificacao'),
  [int[]]$Passos,                       # sem -Passos: todos os passos que tiverem quadros na pasta
  [int]$Colunas = 2
)
Add-Type -AssemblyName System.Drawing
if (-not $Passos) { $Passos = @(Get-ChildItem $Saida -Filter 'real-p*-t*.png' | ForEach-Object { [int]($_.BaseName -replace '^real-p(\d+)-.*$', '$1') } | Sort-Object -Unique) }
foreach ($p in $Passos) {
  $arqs = @(Get-ChildItem $Saida -Filter "real-p$p-t*.png" | Sort-Object Name)
  if (-not $arqs.Count) { "passo $p`: sem quadros"; continue }
  $cw = 640; $ch = 360; $lin = [Math]::Ceiling($arqs.Count / $Colunas)
  $folha = New-Object System.Drawing.Bitmap ($cw * $Colunas), ($ch * $lin)
  $g = [System.Drawing.Graphics]::FromImage($folha); $g.InterpolationMode = 'HighQualityBicubic'; $g.Clear([System.Drawing.Color]::Black)
  $fonte = New-Object System.Drawing.Font 'Consolas', 13, ([System.Drawing.FontStyle]::Bold)
  for ($i = 0; $i -lt $arqs.Count; $i++) {
    $img = [System.Drawing.Image]::FromFile($arqs[$i].FullName); $x = ($i % $Colunas) * $cw; $y = [Math]::Floor($i / $Colunas) * $ch
    $g.DrawImage($img, $x, $y, $cw, $ch); $img.Dispose()
    $g.FillRectangle([System.Drawing.Brushes]::Black, $x + 262, $y + 338, 130, 20)
    $g.DrawString(($arqs[$i].BaseName -replace 'real-', ''), $fonte, [System.Drawing.Brushes]::Yellow, $x + 266, $y + 338)
  }
  $dest = Join-Path $Saida "folha-p$p.png"
  $folha.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $folha.Dispose()
  "passo $p`: $($arqs.Count) quadros -> $dest"
}
