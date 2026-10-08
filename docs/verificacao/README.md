# Verificação do deck animado

Scripts que conferem um deck montado, cena por cena. Rodam com o Chrome ou o Edge em modo headless e não instalam nada. Os caminhos são relativos a esta pasta; capturas e relatório saem na pasta passada em `-Saida` / `--saida` (sem ela, na pasta temporária do sistema, em `deck-animado-verificacao`). Nunca grave saída dentro do projeto.

## Ordem

Num prompt do PowerShell 7, a partir de `apresentacao-animada\`:

```powershell
# 1. monta o deck e roda node --check (sem parâmetros: todas as cenas, no index.html)
& .\fonte\montar.ps1
& .\fonte\montar.ps1 -Cenas 02 -Destino C:\saida\c02.html        # build privado de uma cena

# 2. estado final de cada passo (link direto ?parado=1), um PNG por passo
& .\verificacao\capturar.ps1 -Saida C:\saida\c01                                   # cena 01 do index.html
& .\verificacao\capturar.ps1 -Saida C:\saida\c02 -Deck C:\saida\c02.html -Cena 02    # build privado

# 3. a cena tocando de verdade
node .\verificacao\conferir.mjs --saida C:\saida\c01                                # cena 01 do index.html
node .\verificacao\conferir.mjs --saida C:\saida\c02 --deck C:\saida\c02.html --cena 02

# 4. folhas de contato com os quadros do meio da animação gravados no passo 3
& .\verificacao\folhas.ps1 -Saida C:\saida\c02

# regressão: compara os passoN.png de duas pastas, pixel a pixel
node .\verificacao\comparar.mjs C:\saida\antes C:\saida\depois

# folhas de oficina (todos os componentes desenhados)
& .\verificacao\capturar.ps1 -Saida C:\saida\oficina -Oficina
```

Chame os `.ps1` com `&`, não com `pwsh -File`: com `-File`, uma lista como `-Passos 0,1` chega como texto.

## O que cada um faz

| Script | Faz | Saída |
|---|---|---|
| `capturar.ps1` | Abre `?cena=ID&passo=N&parado=1` para cada passo e fotografa em 1280×720. Sem `-Passos`, lê o número de passos de `fonte\cenaID\esperado.json`. Com `-Oficina`, fotografa `?oficina=1`, `?oficina=2` e `?heroi=1` | `passoN.png` ou `oficina-*.png` |
| `conferir.mjs` | Toca a cena com teclas reais; grava quadros no meio de cada passo; confere HUD e o que está visível ao fim de cada passo; mede o tempo de leitura dos elementos pedidos; compara o fim natural de cada passo com o link direto, pixel a pixel; testa as teclas; confere textos e contagens; confere que o ciano só aparece onde pode; gera o PDF | `real-pN-tTTTTT.png`, `natural-pN.png`, `link-pN.png`, `deck.pdf`, `relatorio.json` |
| `folhas.ps1` | Junta os quadros `real-*` em folhas de contato, uma por passo | `folha-pN.png` |
| `cortes.mjs` | No deck completo, abre o último passo de cada cena, aperta → e fotografa antes da tecla e 80, 350 e 1100 ms depois (a cortina do motor dura 700 ms). Uso: `node .\verificacao\cortes.mjs --saida <pasta>` | `corte-NN-MM-*.png`, `cortes.json` |
| `comparar.mjs` | Compara PNGs de mesmo nome em duas pastas; diz quantos pixels mudaram e onde | texto; código 1 se houver diferença |
| `png.mjs` | Decodificador de PNG usado nas comparações | (módulo) |

`conferir.mjs` lê o esperado da cena em `fonte\cena<id>\esperado.json` (ou no arquivo de `--esperado`). O formato está em `fonte\README.md`, seção 9. Aceita um modo no fim: `real`, `teclas`, `dom` ou `pdf`; sem modo, roda tudo. Sai com código 1 se houver erro de JavaScript ou falha de conferência, e lista as primeiras no terminal; o resto está no `relatorio.json` (`erros` e `falhas`).

## Limites

- Todo comando de navegador tem teto de tempo (45 s por captura, 300 s no `conferir.mjs`) e o processo é morto se passar.
- **Som:** o teste confirma que o contexto de áudio nasce na primeira tecla e mede o pico na saída do compressor. Ninguém ouve nada: timbre e equilíbrio só se conferem com caixa de som.
- **Fluidez:** os quadros provam que a coreografia acontece, não que roda liso. Isso só se vê na máquina da sala.
- Mudou o roteiro, mude o `esperado.json` da cena.
