# Roadmaps do ANI-9

Catálogo aberto de **sementes** de roadmaps de estudo. Uma semente diz aonde
o roadmap vai (o **destino**, os **marcos** do caminho em ordem e o que ficou
de fora) e traz o **primeiro módulo**: passos em ordem de estudo, cada um com
um resumo de um parágrafo, o que a pessoa passa a conseguir fazer, os
critérios pelos quais ela é avaliada e fontes próprias de **teoria** e de
**prática**, cada uma com o seu tipo (oficial, código, artigo, curso, vídeo,
livro, exercício).

No [ANI-9](https://www.ani9.online), as sementes aparecem em
**Roadmaps → Roadmaps didáticos**. Quem clica em **Começar** recebe o escopo e
o primeiro módulo. Os módulos seguintes não vêm daqui: o tutor do ANI-9 cria
cada um quando a pessoa termina o anterior, para ela, sempre na direção do
próximo marco. Quando o último marco é alcançado, o roadmap acabou. No app
também dá para criar um roadmap do zero com o assistente; o catálogo é para
pontos de partida públicos. Os arquivos também servem fora do app: são JSON
simples e legíveis.

Até novembro de 2026 o catálogo guardava roadmaps inteiros. O conteúdo
completo dos dois roadmaps abaixo continua no histórico do Git.

## Roadmaps

| Roadmap | Tema | Nível | Arquivo |
|---|---|---|---|
| Back-end com Go | Tecnologia | Do básico ao avançado | [`models/back-end-go.json`](models/back-end-go.json) |
| Claude Certified Architect – Foundations (CCAR-F) | Tecnologia | Do básico ao avançado | [`models/claude-certified-architect-foundations.json`](models/claude-certified-architect-foundations.json) |

O catálogo é para **qualquer área do conhecimento**, não para um nicho. Os
temas vão de exatas, ciências da natureza, saúde e humanidades a línguas,
direito, negócios, engenharia, artes, educação e concursos. Sugestões de
roadmaps são bem-vindas.

## Estrutura

```
models/              um arquivo por roadmap (models/<chave>.json): a semente
docs/formato.md      o formato "ani9-roadmap", campo a campo
scripts/validate.mjs validador: formato, escopo, limites, fontes em todo passo, links e títulos
CONTRIBUTING.md      como contribuir e o que é uma boa semente
.claude/skills/      skill criar-roadmap para o Claude Code
```

## Validar

Só é preciso Node 20 ou mais novo, sem instalar nada:

```bash
node scripts/validate.mjs                        # todos os modelos
node scripts/validate.mjs models/back-end-go.json --check-links
node scripts/validate.mjs models/back-end-go.json --titles   # título real de cada página
```

O CI valida todo pull request e, uma vez por semana, abre cada link do
catálogo. Quando algum link quebra, ele abre uma issue.

## Como o ANI-9 usa este repositório

O app inclui este repositório numa **versão fixa**, como submódulo. Depois de
cada merge aqui, o app abre sozinho um pull request que move a versão fixa e
roda os testes dele; o modelo entra no ar quando esse pull request é aceito e o
app é publicado. Assim, nenhum modelo chega às pessoas sem passar pelos testes
do app.

## Criar um roadmap com o Claude Code

O repositório traz a skill [`criar-roadmap`](.claude/skills/criar-roadmap/SKILL.md).
Com o [Claude Code](https://code.claude.com) aberto na raiz do repositório, rode:

```
/criar-roadmap <tema> [público/nível] [objetivo]
```

A skill pesquisa o assunto, propõe o escopo (destino e marcos) e espera o seu
sim, escreve o primeiro módulo, abre e confere cada fonte, grava
`models/<chave>.json` e roda o validador. Ela só abre
um pull request se você pedir. O resultado segue as mesmas regras do
[CONTRIBUTING.md](CONTRIBUTING.md) e passa pela mesma revisão de qualquer
contribuição.

## Contribuir

Veja o [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

- **Roadmaps** (`models/`, `docs/`): [CC BY 4.0](LICENSE). Pode copiar,
  adaptar e usar, inclusive comercialmente, desde que cite a fonte
  ("Roadmaps do ANI-9").
- **Scripts** (`scripts/`): [MIT](scripts/LICENSE).

As fontes indicadas pertencem aos seus autores. Os roadmaps só apontam para
elas.
