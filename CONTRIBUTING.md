# Como contribuir

Contribuições são bem-vindas: uma semente de roadmap nova, uma fonte melhor,
um link quebrado, um resumo mais claro. O catálogo vale para **qualquer área do
conhecimento**, como saúde, línguas, direito, exatas, artes ou tecnologia, e
não para um nicho.

## Caminhos

- **Corrigir algo pequeno** (link quebrado, erro de digitação, fonte melhor):
  edite o arquivo em `models/` e abra um pull request.
- **Propor um roadmap novo:** abra antes uma issue com o modelo "Sugerir
  roadmap", para combinar o escopo (o destino e os marcos) e evitar trabalho
  duplicado. Depois, envie a semente em `models/<chave>.json`.
- **Só avisar de um problema:** abra uma issue com o modelo "Link quebrado ou
  fonte ruim".

## Antes de abrir o pull request

```bash
node scripts/validate.mjs models/<chave>.json --check-links
```

O comando precisa terminar com "Sem erros.". Leia também os avisos. O CI roda
a mesma validação em todo pull request. Só é preciso Node 20 ou mais novo, sem
instalar nada.

O formato completo está em [`docs/formato.md`](docs/formato.md).

## O que o catálogo guarda

No ANI-9, um roadmap didático não é publicado inteiro: ele cresce com a
pessoa. O catálogo guarda **sementes** (formato 4): o **escopo** do roadmap (o
destino, os marcos do caminho em ordem e o que ficou de fora) e o seu
**primeiro módulo**. Os módulos seguintes são feitos pelo tutor do ANI-9, um
por vez, para quem está seguindo o roadmap. Não envie os outros módulos.

## O que é uma boa semente

- **Tem fim:** o destino é uma frase que dá para conferir ("Publicar uma API
  em Go com testes"), e os marcos, de 4 a 12, levam até ele em ordem.
- **Começa de verdade:** o primeiro módulo já alcança o primeiro marco, em
  cerca de uma a duas semanas de estudo, e não é uma "introdução".
- **Útil:** todo passo abre com um parágrafo próprio (o que é e por que
  importa), diz o que a pessoa passa a conseguir fazer, e traz fontes
  próprias, verificadas e tipadas.
- **Avaliável:** todo passo tem critérios que pedem para explicar, aplicar,
  comparar, depurar ou construir, cada um com o que a resposta precisa trazer.
- **Fiel ao assunto:** a quantidade de passos e de fontes vem do assunto, não
  de uma cota; escolhas entre opções são marcadas (recomendado, alternativa) e
  o que não trava o caminho é opcional.
- **Honesta:** não promete resultado ("aprenda em 30 dias", "memorize 2×
  mais"). O roadmap organiza o estudo; o ganho de aprendizagem depende de
  quem estuda.

### Escopo

- [ ] O destino é o que a pessoa vai conseguir fazer, não o nome do assunto.
- [ ] De 4 a 12 marcos, em ordem de aprendizagem: cada um depende só dos
      anteriores, e o último chega ao destino.
- [ ] Nenhum marco genérico ("Conceitos básicos", "Avançado", "Extras").
- [ ] `out` diz o que alguém esperaria encontrar e ficou de fora.

### Primeiro módulo

- [ ] `closes` é o primeiro marco do escopo (ou os primeiros, em ordem).
- [ ] De 3 a 8 passos, em ordem de estudo; cada passo é uma coisa só.
- [ ] Toda escolha entre opções tem `choice: true`, uma `recomendado` e as
      outras `alternativa`; o que não trava o caminho está `opcional`.
- [ ] Todo passo tem objetivos que começam por um verbo observável e de 2 a 4
      critérios com `expect` concreto, que as fontes sustentam.

### Texto

- [ ] Todo passo tem um parágrafo próprio: o que é e por que importa ou
      quando se usa. Sem fórmula repetida em todos os passos.
- [ ] Os títulos são curtos (até cerca de 60 caracteres) e usam o termo que a
      área usa.
- [ ] Português correto, sem jargão desnecessário.

### Fontes

**Teoria (para entender):** documentação oficial ou especificação, material
universitário aberto, livros abertos de autoria reconhecida, artigos de
referência com data e autoria.

**Prática (para fazer):** exercícios ou laboratórios interativos, tutoriais
guiados, desafios com correção, listas de exercícios com gabarito, estudos de
caso, simuladores, questões de provas oficiais.

- [ ] Todo passo tem ao menos uma fonte própria, que trata dele (a página do
      assunto, não a inicial do site), com `format` (oficial, código, artigo,
      curso, vídeo, podcast, livro, exercício). O módulo tem teoria e prática.
- [ ] Toda URL foi aberta e trata do passo. Nunca invente nem deduza URLs;
      `--titles` mostra o título real de cada página.
- [ ] As fontes de prática exigem que a pessoa faça algo.
- [ ] Fontes gratuitas. Uma fonte paga só entra se for a referência
      indiscutível, e o título avisa "(pago)".
- [ ] Links estáveis, sem rastreamento (`utm_`, `ref=`), sem encurtadores e
      sem páginas de busca ou de login.
- [ ] Título da fonte no formato `Site ou autor: assunto`.
- [ ] Poucas e boas: tipicamente 2 a 4 por passo, até 8 quando há material
      bom de tipos diferentes.

## Direitos

Os modelos só **apontam** para as fontes, não copiam o conteúdo delas.
Não copie textos, listas de cartões nem listas de fontes de outros roadmaps:
use-os só para conferir cobertura e granularidade. O roadmap.sh, por exemplo,
só permite uso pessoal do seu conteúdo. O método (cartões com conteúdo e
fontes próprias, marcações, granularidade pelo assunto) é de todos; o conteúdo
é escrito e escolhido aqui.

Os mapas livres das versões 1 e 2 do formato (copiados para um quadro com
**Usar modelo**) continuam aceitos; as regras deles estão em
[`docs/formato.md`](docs/formato.md).

Ao contribuir, você concorda em licenciar sua contribuição sob a
[CC BY 4.0](LICENSE). Os scripts ficam sob a [licença MIT](scripts/LICENSE).
