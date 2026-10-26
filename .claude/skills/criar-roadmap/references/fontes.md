# Como escolher fontes

Cada cartão (tópico ou subtópico) tem as **suas** fontes: as que tratam daquele
assunto, apontando para a seção, o capítulo ou a página certa. A fonte de um
tópico não serve de fonte dos subtópicos dele.

## Para que serve (`kind`)

- **`teoria`:** para entender. Ler, assistir, ouvir.
- **`pratica`:** para fazer. A pessoa produz algo: código, exercícios
  resolvidos, um diagrama, um caso analisado.

## O que é (`format`)

Em ordem de preferência, que é também a ordem em que ficam listadas:

| `format` | O que entra | Exemplos |
|---|---|---|
| `oficial` | documentação, especificação, guia ou norma de quem mantém o assunto | MDN, docs da linguagem, RFC, W3C, guia oficial do exame, norma técnica, site do órgão |
| `codigo` | repositório aberto para ler ou rodar | exemplos oficiais, projeto de referência |
| `artigo` | texto de referência de terceiros, com autoria e data | blog de engenharia de referência, artigo de autor reconhecido |
| `curso` | curso gratuito, ou com trilha gratuita útil | MIT OpenCourseWare, CS50, Khan Academy |
| `video` | aula ou palestra com autoria clara | canal oficial, universidade, autor reconhecido |
| `podcast` | episódio específico sobre o assunto | |
| `livro` | livro aberto, ou capítulo gratuito | *Eloquent JavaScript*, *The Rust Programming Language* |
| `exercicio` | algo para fazer, com enunciado | Exercism, SQLBolt, Learn Git Branching, laboratórios oficiais, listas com gabarito |

Fora da programação vale o mesmo: diretrizes oficiais e normas (`oficial`),
material universitário (`curso`), listas de exercícios com gabarito, estudos
de caso e questões de provas oficiais (`exercicio`).

## Quantas

- **Ao menos 1 por cartão.** Tipicamente 2 a 4; até 8 quando há material bom
  de tipos diferentes (a doc oficial, um artigo que explica melhor, um vídeo,
  um exercício).
- **Todo tópico:** ao menos uma de `teoria` e uma de `pratica`.
- Mais fontes não é melhor: cada uma precisa ganhar o lugar.

## Regras

- **Abra toda URL.** A página tem que abrir, tratar do cartão e ter conteúdo
  útil sem pagar. Depois de gravar, `node scripts/validate.mjs <arquivo>
  --titles` mostra o título real de cada página ao lado do nome dado.
- **Nunca invente URLs**, nem as deduza pelo padrão de outras páginas do mesmo
  site. Ache a página (sumário, `llms.txt`, busca) e abra.
- **A página do assunto, não a inicial.** "Docs do PostgreSQL" não é fonte de
  "Índices"; o capítulo de índices é.
- **A mesma URL não se repete** no roadmap.
- **Links estáveis:** a página do capítulo ou da seção. Evite buscas, âncoras
  frágeis e versões antigas fixas, como `/v2/` quando já existe `/v5/`.
- **Fonte paga** só entra se for a referência indiscutível; avise no título,
  com "(pago)".
- **Idioma:** português quando a qualidade for equivalente; senão, a referência
  em inglês. Marque "(em inglês)" no título só em roadmaps para iniciantes.
- **Título da fonte:** `Site ou autor: assunto`, como "MDN: Métodos HTTP". Não
  copie o `<title>` da página, cheio de SEO.
- **Nada de afiliados, rastreamento** (`utm_`, `ref=`) **ou encurtadores.**
- **Vídeo** só de canal oficial, universidade ou autor reconhecido.
- **Não copie listas de fontes de outros roadmaps.** Ache e escolha as suas.
