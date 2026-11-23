# Formato `ani9-roadmap`

Todo arquivo do catálogo é um JSON em UTF-8, gravado em `models/<chave>.json`.
O nome do arquivo, sem `.json`, é a chave e só pode ter a-z, 0-9 e hífen.

O validador (`scripts/validate.mjs`) confere as regras desta página, e o ANI-9
valida de novo ao carregar os arquivos. O formato tem quatro versões:

| Versão | O que é | Situação |
|---|---|---|
| 4 | **Semente** de roadmap didático: o escopo e o primeiro módulo | todo roadmap novo do catálogo |
| 3 | Roadmap didático escrito inteiro | não publique; o app lê só a semente que ele contém |
| 2 e 1 | **Mapa livre**, copiado para um quadro com **Usar modelo** | continuam aceitas |

## Semente de roadmap didático (versão 4)

No ANI-9, um roadmap didático não é publicado inteiro: ele cresce com a
pessoa.

- O roadmap tem um **escopo**, combinado no começo: o **destino** (o que a
  pessoa vai conseguir fazer quando ele acabar), os **marcos** do caminho, em
  ordem, e o que ficou de fora de propósito. É o escopo que faz o roadmap ter
  fim.
- O roadmap é feito de **módulos**. Um módulo é um grupo de **passos**, cada
  um com resumo, objetivos, critérios de avaliação e fontes. No começo só
  existe o primeiro módulo.
- Cada módulo seguinte é feito pelo **tutor** do ANI-9 (o assistente do app),
  um por vez, só depois que a pessoa termina o atual, e para aquela pessoa: o
  tutor pergunta o que foi difícil, que tipo de fonte funcionou e o que a
  motiva, e monta o próximo módulo a partir disso.
- Um módulo sempre leva ao próximo marco do escopo, ou aos próximos, em ordem.
  Por isso nunca há mais módulos do que marcos, e o roadmap acaba quando o
  último marco é alcançado. Ir além pede um novo combinado sobre o escopo.

Por isso o catálogo não guarda roadmaps inteiros. Guarda **sementes**: o
escopo e o primeiro módulo. Um roadmap com todo o conteúdo só existe quando
alguém que o percorreu compartilha o seu; quem recebe um roadmap inacabado
continua com o próprio tutor.

### Exemplo

```json
{
  "format": "ani9-roadmap",
  "version": 4,
  "revision": 1,
  "title": "Back-end com Node.js",
  "summary": "Para quem já programa e quer construir e publicar APIs em Node.js.",
  "area": "tecnologia",
  "level": "intermediario",
  "scope": {
    "destination": "Publicar uma API em Node.js com banco de dados, testes e autenticação.",
    "milestones": [
      { "id": "http", "title": "HTTP" },
      { "id": "servidor-em-node", "title": "Um servidor em Node.js" },
      { "id": "banco-de-dados", "title": "Banco de dados" },
      { "id": "testes", "title": "Testes" },
      { "id": "autenticacao", "title": "Autenticação" },
      { "id": "publicacao", "title": "Publicação" }
    ],
    "out": ["Front-end", "GraphQL e gRPC", "Orquestração de containers"]
  },
  "module": {
    "closes": ["http"],
    "id": "http",
    "title": "HTTP",
    "summary": "O protocolo de pedidos e respostas que toda API web usa. Entender métodos, cabeçalhos e códigos de status é o que permite desenhar rotas previsíveis e depurar o que chega ao servidor.",
    "resources": [
      { "kind": "teoria", "format": "oficial", "title": "MDN: Visão geral do HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview" },
      { "kind": "pratica", "format": "oficial", "title": "curl: tutorial de uso", "url": "https://curl.se/docs/tutorial.html" }
    ],
    "subtopics": [
      {
        "id": "metodos-http",
        "title": "Métodos HTTP",
        "summary": "GET, POST, PUT, PATCH e DELETE dizem a intenção do pedido. Saber quais são seguros e idempotentes evita, por exemplo, cobrar duas vezes quando o cliente repete um pedido.",
        "objectives": ["Escolher o método certo para cada operação de uma API"],
        "criteria": [
          {
            "id": "idempotencia",
            "text": "Explica o que é um método idempotente e dá um exemplo",
            "kind": "explicar",
            "expect": "Repetir o pedido deixa o servidor no mesmo estado. PUT e DELETE são idempotentes; POST, não."
          },
          {
            "id": "escolher-o-metodo",
            "text": "Escolhe o método para ler, criar, substituir, alterar em parte e apagar um recurso",
            "kind": "aplicar",
            "expect": "GET para ler, POST para criar, PUT para substituir o recurso inteiro, PATCH para alterar parte dele e DELETE para apagar."
          }
        ],
        "resources": [
          { "kind": "teoria", "format": "oficial", "title": "MDN: Métodos de requisição HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Methods" }
        ]
      },
      {
        "id": "codigos-de-status",
        "title": "Códigos de status",
        "summary": "As classes 2xx, 3xx, 4xx e 5xx dizem o que aconteceu com o pedido. Com o código certo, o cliente sabe se deu certo, se o erro é dele ou se vale tentar de novo.",
        "objectives": ["Escolher o código de status de cada resposta de uma API"],
        "criteria": [
          {
            "id": "classes",
            "text": "Explica o que indica cada classe de código, de 2xx a 5xx",
            "kind": "explicar",
            "expect": "2xx: o pedido deu certo. 3xx: redirecionamento. 4xx: erro no pedido do cliente. 5xx: falha do servidor."
          },
          {
            "id": "erro-de-quem",
            "text": "Resolve o caso: a API devolve 500 quando o cliente manda um JSON inválido. Diz o que está errado e que código usar",
            "kind": "depurar",
            "expect": "O erro está no pedido, não no servidor: a resposta é da classe 4xx, como 400. Com 500, o cliente entende que a falha é do servidor e repete o mesmo pedido."
          }
        ],
        "resources": [
          { "kind": "teoria", "format": "oficial", "title": "MDN: Códigos de status de resposta HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status" }
        ]
      }
    ]
  }
}
```

O exemplo tem dois passos para caber na página; um primeiro módulo costuma ter
de 3 a 8. As duas sementes do catálogo, em [`models/`](../models), são exemplos
completos.

### Campos da raiz

| Campo | Obrigatório | Regra |
|---|---|---|
| `format` | sim | sempre `"ani9-roadmap"` |
| `version` | sim | `4` |
| `revision` | sim | inteiro a partir de 1; some 1 a cada mudança publicada da semente |
| `title` | sim | até 120 caracteres; é o nome do roadmap na lista |
| `summary` | recomendado | até 400 caracteres: para quem é e aonde leva |
| `area` | sim | tema, para o filtro da lista: um dos valores de [Temas](#temas-area) |
| `level` | sim | `"iniciante"`, `"intermediario"`, `"avancado"` ou `"completo"` (do básico ao avançado) |
| `scope` | sim | o escopo: aonde o roadmap vai |
| `module` | sim | o primeiro módulo |

A semente não tem `topics` nem `links`: o resto do caminho não é escrito, e um
pré-requisito entre passos vai em `requires`. Não acrescente campos que não
estão nesta página: o validador avisa ("campo desconhecido") e o app recusa a
semente.

### Escopo (`scope`)

| Campo | Obrigatório | Regra |
|---|---|---|
| `destination` | sim | uma frase, até 400 caracteres: o que a pessoa vai conseguir fazer quando o roadmap acabar |
| `milestones` | sim | de 2 a 60 marcos, na ordem do caminho |
| `milestones[].id` | sim | slug (a-z, 0-9, hífen), até 80 caracteres, único entre os marcos |
| `milestones[].title` | sim | até 120 caracteres. O marco só tem `id` e `title` |
| `out` | não | até 12 frases, de até 300 caracteres cada: o que ficou de fora de propósito |

O que faz um bom escopo (recomendação, não regra do validador):

- **O destino dá para conferir.** É uma frase sobre o que a pessoa vai
  conseguir fazer ("Publicar uma API em Go com testes"), não o nome de um
  assunto ("Back-end com Go").
- **De 4 a 12 marcos.** O limite é 60, mas um bom escopo deixa ver o fim. As
  duas sementes do catálogo têm 20 e 15 marcos porque vieram de roteiros
  longos; uma semente nova deve ser mais enxuta.
- **Marcos em ordem.** Cada um depende só dos anteriores, e o último chega ao
  destino. Como cada módulo alcança pelo menos um marco, o número de marcos é
  o máximo de módulos que o roadmap pode ter.
- **`out` diz o que alguém esperaria encontrar** e não está no caminho.

### Primeiro módulo (`module`)

O módulo é o que a versão 3 chamava de tópico, ou etapa: um cartão que traz os
seus **passos** em `subtopics`. Um passo pode ter `subtopics` próprios (as
opções de uma escolha ou as partes de um assunto); esse é o último nível.

O cartão do módulo:

| Campo | Obrigatório | Regra |
|---|---|---|
| `closes` | sim | os marcos que o módulo alcança: o `id` do primeiro marco do escopo, ou dos primeiros, na ordem |
| `id`, `title`, `summary` | sim | como nos passos |
| `resources` | sim | as fontes do módulo, com ao menos uma de `teoria` e uma de `pratica` |
| `objectives` | não | o que a pessoa passa a conseguir fazer ao fim do módulo |
| `subtopics` | sim | os passos, em ordem de estudo |

O módulo não tem `choice` nem `requires`.

Cada passo, em qualquer dos dois níveis:

| Campo | Obrigatório | Regra |
|---|---|---|
| `id` | sim | slug estável (a-z, 0-9, hífen), até 80 caracteres, único entre os cartões do arquivo. **Não mude o id de um cartão publicado**: é por ele que o app grava o progresso |
| `title` | sim | até 120 caracteres (prefira até 60); único no arquivo, sem diferenciar maiúsculas de minúsculas |
| `summary` | sim | um parágrafo, até 400 caracteres: o que é e por que importa |
| `objectives` | sim | de 1 a 8 frases, de até 300 caracteres cada: o que a pessoa passa a conseguir fazer. Comece pelo verbo |
| `criteria` | sim | de 1 a 8 (ideal: 2 a 4): o que conta como prova. Ao menos um é obrigatório |
| `criteria[].id` | sim | slug único dentro do passo |
| `criteria[].text` | sim | o que a pessoa precisa mostrar, até 300 caracteres |
| `criteria[].kind` | sim | `explicar`, `aplicar`, `comparar`, `depurar` ou `construir` |
| `criteria[].expect` | sim | o que a resposta certa precisa trazer, até 600 caracteres. Só o tutor vê |
| `criteria[].required` | não | `false` tira o critério da conta da aprovação |
| `resources` | sim | ao menos uma fonte própria: veja [Fontes](#fontes-resources) |
| `requires` | não | ids de passos do módulo que precisam vir antes |
| `choice` | não | `true`: os subtópicos deste passo são opções, e provar uma basta. Pede ao menos duas opções |
| `marker` | não | `"recomendado"`, `"alternativa"` ou `"opcional"`: veja [Marcações](#marcações-marker) |
| `subtopics` | não | até 30 cartões, só nos passos do primeiro nível |

Uma escolha fica assim (recorte: cada um dos três cartões tem também resumo,
objetivos, critérios e fontes, como qualquer passo):

```json
{
  "id": "escolha-um-cliente-http",
  "title": "Escolha um cliente HTTP",
  "choice": true,
  "subtopics": [
    { "id": "curl", "title": "curl", "marker": "recomendado" },
    { "id": "httpie", "title": "HTTPie", "marker": "alternativa" }
  ]
}
```

O que faz um bom primeiro módulo (recomendação, não regra do validador):

- **Uma a duas semanas de estudo:** de 3 a 8 passos, em ordem.
- **Cada passo é uma coisa só,** que dá para estudar em uma ou duas sessões.
- **De 2 a 4 critérios por passo,** que pedem para explicar, aplicar,
  comparar, depurar ou construir. Nunca para decorar ou reconhecer.

### Como o app usa a semente

No app, as sementes aparecem em **Roadmaps → Roadmaps didáticos**. **Começar**
cria o roadmap da pessoa, com o escopo e o primeiro módulo da semente. Depois:

- um passo abre quando os passos de `requires` foram concluídos; o que fica
  abaixo de um passo (uma opção, uma parte) abre depois dele;
- ao estudar, a pessoa vê o resumo, os objetivos e as fontes. Os critérios e o
  `expect` ficam com o tutor, que avalia o passo por eles;
- o módulo termina quando todos os passos obrigatórios terminam. Passo
  `opcional` não trava, e numa escolha (`choice`) basta uma opção que não seja
  opcional;
- terminado o módulo, o tutor monta o seguinte para aquela pessoa, na direção
  do próximo marco. Esse módulo não vem do catálogo;
- alcançado o último marco, o roadmap acabou.

## Fontes (`resources`)

Da versão 2 em diante, todo cartão tem ao menos uma fonte própria, que trata
dele. São até 12 por cartão; o validador avisa acima de 8.

| Campo | Obrigatório | Regra |
|---|---|---|
| `kind` | sim | `"teoria"` (ler, assistir) ou `"pratica"` (fazer), sem acento |
| `format` | sim | o que a fonte é: veja a tabela abaixo |
| `title` | sim | até 120 caracteres: nome claro da fonte |
| `url` | sim | `https://…` completo, até 500 caracteres |

A mesma URL não se repete no arquivo: cada cartão aponta para a parte da fonte
que trata dele (a seção, o capítulo, a página).

O `format` aparece como etiqueta ao lado da fonte. No painel do cartão, as
fontes são listadas nesta ordem.

| Valor | Na tela | Quando usar |
|---|---|---|
| `oficial` | Oficial | documentação, especificação, guia ou norma de quem mantém o assunto |
| `codigo` | Código | repositório aberto para ler ou rodar |
| `artigo` | Artigo | texto de referência de terceiros |
| `curso` | Curso | curso gratuito, ou com trilha gratuita útil |
| `video` | Vídeo | aula ou palestra com autoria clara |
| `podcast` | Podcast | episódio específico |
| `livro` | Livro | livro aberto, ou capítulo gratuito |
| `exercicio` | Exercício | algo para fazer: tutorial guiado, lista, laboratório, desafio |

`kind` e `format` dizem coisas diferentes: `kind` é o uso no estudo (ler ou
fazer), `format` é o que a fonte é. Um tutorial oficial em que se escreve
código é `pratica` + `oficial`; um livro é `teoria` + `livro`.

## Marcações (`marker`)

A maioria dos cartões não tem marcação. No mapa livre, ela aparece no cartão e
na legenda do quadro. Num módulo, ela também decide o que conta para terminar:
passo `opcional` não trava, e as opções de uma escolha são `recomendado` e
`alternativa`.

| Valor | Na tela | Quando usar |
|---|---|---|
| `recomendado` | Recomendado | entre opções equivalentes, a escolha sugerida para começar |
| `alternativa` | Alternativa | serve no lugar da recomendada: escolha uma |
| `opcional` | Opcional | aprenda quando precisar ou em qualquer ordem; não trava o caminho |

## Temas (`area`)

São temas amplos de propósito: o ANI-9 serve para estudar qualquer assunto,
não um nicho. Escolha o que mais se aproxima; na dúvida, `"outros"`.

| Valor | Tema na tela |
|---|---|
| `exatas` | Exatas e matemática |
| `natureza` | Ciências da natureza |
| `saude` | Saúde |
| `humanidades` | Humanidades |
| `linguas` | Línguas e comunicação |
| `direito` | Direito |
| `negocios` | Negócios e finanças |
| `tecnologia` | Tecnologia |
| `engenharia` | Engenharia |
| `artes` | Artes e design |
| `educacao` | Educação |
| `concursos` | Concursos e vestibulares |
| `outros` | Outros |

## Mapa livre (versões 1 e 2)

O mapa livre traz o mapa inteiro. No app, quem clica em **Usar modelo** recebe
uma cópia própria, montada assim no quadro:

- os **tópicos** formam a espinha do mapa, de cima para baixo, ligados em ordem
  por setas contínuas;
- os **subtópicos** de cada tópico ficam numa coluna ao lado dele, alternando
  direita e esquerda (o 1º tópico abre para a direita, o 2º para a esquerda…),
  ligados por setas tracejadas;
- um subtópico pode ter **seus próprios subtópicos** (um nível a mais), numa
  coluna mais para fora: as opções de uma escolha ou as partes de um assunto;
- a **marcação** de um cartão (recomendado, alternativa, opcional) aparece no
  cartão e na legenda do quadro;
- cada item de `links` acrescenta mais uma seta.

**Todo cartão é clicável e tem conteúdo próprio**, seja tópico ou subtópico, em
qualquer nível: um resumo e as fontes daquele assunto.

```json
{
  "format": "ani9-roadmap",
  "version": 2,
  "title": "Back-end com Node.js",
  "summary": "Para quem já programa e quer construir e publicar APIs em Node.js.",
  "area": "tecnologia",
  "level": "intermediario",
  "topics": [
    {
      "title": "HTTP",
      "summary": "O protocolo de pedidos e respostas que toda API web usa. Entender métodos, cabeçalhos e códigos de status é o que permite desenhar rotas previsíveis e depurar o que chega ao servidor.",
      "resources": [
        { "kind": "teoria", "format": "oficial", "title": "MDN: Visão geral do HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview" },
        { "kind": "pratica", "format": "oficial", "title": "curl: tutorial de uso", "url": "https://curl.se/docs/tutorial.html" }
      ],
      "subtopics": [
        {
          "title": "Métodos HTTP",
          "summary": "GET, POST, PUT, PATCH e DELETE dizem a intenção do pedido. Saber quais são seguros e idempotentes evita, por exemplo, cobrar duas vezes quando o cliente repete um pedido.",
          "resources": [
            { "kind": "teoria", "format": "oficial", "title": "MDN: Métodos de requisição HTTP", "url": "https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Methods" }
          ]
        }
      ]
    },
    {
      "title": "Banco de dados",
      "summary": "…",
      "resources": ["…"],
      "subtopics": [
        {
          "title": "Bancos relacionais",
          "summary": "…",
          "resources": ["…"],
          "subtopics": [
            { "title": "PostgreSQL", "marker": "recomendado", "summary": "…", "resources": ["…"] },
            { "title": "MySQL", "marker": "alternativa", "summary": "…", "resources": ["…"] }
          ]
        }
      ]
    }
  ],
  "links": [{ "from": "Códigos de status", "to": "Tratamento de erros" }]
}
```

| Campo | Obrigatório | Regra |
|---|---|---|
| `version` | sim | `2` (a `1` ainda é aceita) |
| `topics` | sim | de 1 a 60 tópicos, em ordem de aprendizagem; cada um com fonte de `teoria` e de `pratica` |
| `topics[].subtopics` | não | até 30 itens; quantos o assunto pedir |
| `topics[].subtopics[].subtopics` | não | até 30 itens; é o último nível |
| `links` | não | até 200 itens `{ "from", "to" }`, com títulos de cartões existentes |

`format`, `title`, `summary`, `area` e `level` valem como na semente. Os
cartões (tópicos e subtópicos, em qualquer nível) têm `title`, `summary`,
`marker` e `resources`, com as mesmas regras dos passos de uma semente. Não
existem `revision`, `scope`, `module`, `id`, `objectives`, `criteria`,
`requires` nem `choice`.

Mais regras:

- O modelo tem no máximo 400 cartões.
- Títulos são únicos no modelo: as ligações (`links`) usam o título.
- Ligações para títulos que não existem são erro no validador e são ignoradas
  ao montar o quadro.

A **versão 1** não tem o `format` das fontes, `marker` nem o terceiro nível, e
só exige resumo e fontes nos tópicos. O app e o validador continuam aceitando,
mas o validador avisa para migrar para a 2.

## Versão 3

A versão 3 era o roadmap didático escrito inteiro: no lugar de `scope` e
`module`, uma lista `topics` com todos os tópicos e todos os cartões. Ninguém
deve publicar um arquivo novo nessa versão.

O app ainda lê um arquivo da versão 3, mas só como a semente que ele contém: o
roteiro de tópicos vira os marcos, e só o primeiro tópico é usado, como
primeiro módulo. O validador avisa.

Para converter um arquivo da versão 3: escreva o `scope`, passe o primeiro
tópico para `module`, com `closes` no primeiro marco, apague `topics` e some 1
em `revision`. As regras dos cartões são as mesmas.
