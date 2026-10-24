---
name: "criar-roadmap"
description: "Cria um roadmap de estudo para o catálogo ani9-roadmaps a partir de um tema: tópicos em ordem, subtópicos, resumos diretos e fontes verificadas de teoria e de prática, em models/<chave>.json. Use quando pedirem para criar, gerar ou montar um roadmap, trilha ou modelo de estudo sobre qualquer assunto."
argument-hint: "Tema [público/nível] [objetivo]"
user-invocable: true
disable-model-invocation: false
---

# Criar roadmap

## Entrada

```text
$ARGUMENTS
```

Você recebe um tema e, às vezes, também o público, o nível ou o objetivo. O
resultado é **um roadmap do catálogo**: um arquivo JSON em
`models/<chave>.json`, na raiz deste repositório
([ani9-roadmaps](https://github.com/VitoorFranca/ani9-roadmaps), público, sob
CC BY 4.0).

No [ANI-9](https://www.ani9.online), os roadmaps do catálogo aparecem em
**Roadmaps → Modelos do ANI-9**. Quem clica em **Usar modelo** recebe uma cópia
própria, com os cartões ligados por setas, os resumos e as fontes, e pode
editar tudo no quadro. O app traz o catálogo numa versão fixa: um roadmap
novo só aparece lá depois do merge aqui e de uma atualização do app.

O catálogo é para **qualquer área do conhecimento**, não para um nicho.

## O que é um bom roadmap aqui

- **Robusto:** cobre o que um profissional da área espera que a pessoa saiba,
  na ordem em que se aprende, sem lacunas que travem o próximo passo.
- **Útil:** cada tópico diz o que é e o que a pessoa precisa conseguir fazer.
  Cada fonte foi aberta e escolhida, não só listada.
- **Direto:** informação básica e objetiva. O roadmap entrega a rede, não o
  peixe: aponta o caminho e as fontes, sem resumir a matéria inteira.
- **Completo:** todo tópico tem pelo menos uma fonte de **teoria** e uma de
  **prática** (o validador exige isso). O caminho termina num projeto ou
  exercício que junta tudo.
- **Profissional:** terminologia correta e fontes primárias e atuais. Nada de
  enchimento, SEO, links de afiliado, nem fonte paga quando existe uma gratuita
  equivalente.

Não prometa efeito didático ("você vai memorizar 2× mais"). O roadmap organiza
o estudo; ganho de aprendizagem é hipótese, não fato comprovado.

## Procedimento

1. **Entender o pedido.** Identifique o tema e, se vierem, o público, o nível de
   partida e o objetivo.
   - Se faltar algo, assuma: de iniciante a profissional júnior, texto em
     português, fontes em português quando forem tão boas quanto, e em inglês
     quando forem a referência. Diga as suposições no relatório.
   - Só pergunte se o tema for ambíguo a ponto de mudar o roadmap inteiro.
   - Atualize o repositório com `git checkout main` e `git pull --ff-only`.
   - Veja os roadmaps que já existem com `ls models/`. Se já houver um do mesmo
     tema, avise e melhore esse arquivo em vez de criar um duplicado.

2. **Mapear a área antes de escrever.** Pesquise com WebSearch e WebFetch:
   - documentação oficial e especificações;
   - ementas de universidades;
   - currículos ou guias oficiais de certificações e provas (se o tema for uma
     certificação, comece pelo guia oficial do exame e cubra todas as tarefas
     dele);
   - guias de carreira e roadmaps conhecidos.

   Esses roadmaps servem **só para conferir cobertura**. Nunca copie estrutura
   ou texto deles; a licença do roadmap.sh, por exemplo, proíbe reutilizar. O
   que aparece em várias fontes é o núcleo.

3. **Desenhar o caminho.**
   - Use de 6 a 14 tópicos em ordem de aprendizagem; cada um depende só dos
     anteriores. Passe disso só quando o tema pedir, como um exame com muitos
     domínios.
   - O primeiro tópico é a base real, não "Introdução". O último é um projeto
     ou exercício integrador.
   - Use de 2 a 6 subtópicos por tópico, só quando ajudam: são os detalhes que
     a pessoa precisa conhecer pelo nome.
   - Use `links` só para pré-requisitos fora da sequência, como um subtópico
     de "Bancos de dados" que é necessário em "Autenticação". Não ligue passos
     que já são vizinhos no caminho. Use poucos: cada um vira uma seta no
     quadro.
   - Deixe de fora o que for avançado demais para o objetivo. Isso vai no
     relatório como "próximos passos", não no roadmap.

4. **Escrever os resumos.**
   - **Tópico:** até 2 frases e no máximo 400 caracteres (ideal: menos de
     250). Diga **o que é**, em linguagem simples, e complete **"Você domina
     quando…"** com uma capacidade concreta e verificável. Exemplo: "Você
     domina quando consegue explicar por que uma consulta ficou lenta e criar
     o índice que resolve."
   - **Subtópico:** uma frase. Não explique a matéria; aponte o que procurar.

5. **Escolher as fontes.** Siga [`references/fontes.md`](references/fontes.md)
   e o [`CONTRIBUTING.md`](../../../CONTRIBUTING.md).
   - **Por tópico:** 1 ou 2 de teoria e 1 ou 2 de prática, no máximo 4 no
     total.
   - **Abra cada link com WebFetch** e confirme que a página existe, trata do
     tópico e é gratuita (ou tem uma parte gratuita útil).
   - **Nunca invente URLs** nem as deduza pelo padrão de outras. Se não der
     para confirmar, troque a fonte. Os índices `llms.txt` de sites de
     documentação ajudam a achar as páginas certas.

6. **Gravar o roadmap** em `models/<chave>.json`, no formato de
   [`docs/formato.md`](../../../docs/formato.md).
   - A `<chave>` é o tema em slug: só a-z, 0-9 e hífen, como `back-end-node`.
   - Preencha `area` (tema amplo, para o filtro da lista) e `level` (nível de
     partida e de chegada), com os valores de `docs/formato.md`.
   - Grave com indentação de 2 espaços.
   - Acrescente o roadmap à tabela "Roadmaps" do `README.md`.

7. **Validar e corrigir.** Na raiz do repositório, rode:

   ```bash
   node scripts/validate.mjs models/<chave>.json --check-links
   ```

   - Corrija **todos os erros** até o validador dizer "Sem erros.". O CI roda
     a mesma validação em cada pull request.
   - Leia cada aviso e corrija o que fizer sentido.
   - Quando um site bloquear a verificação (HTTP 403/429), confirme o link com
     WebFetch.

8. **Revisar** com a lista de [`references/qualidade.md`](references/qualidade.md)
   e ajustar o que falhar.

9. **Publicar, só se a pessoa pedir.** O repositório é público: nada vai para
   o GitHub sem pedido explícito. Crie o branch `roadmap/<chave>`, faça o
   commit do arquivo e do README (adicionando-os pelo nome) e abra um pull
   request com `gh pr create`, seguindo o modelo de pull request do
   repositório. Espere o CI passar. O merge fica com quem mantém o catálogo.

10. **Relatar**, em poucas linhas:
    - onde o arquivo foi salvo;
    - a sequência de tópicos, numa linha;
    - quantos cartões e quantas fontes;
    - as suposições feitas;
    - o que ficou de fora de propósito.

## Erros comuns

- Tópicos genéricos ("Conceitos básicos", "Avançado", "Boas práticas"). Nomeie
  o conteúdo de verdade.
- Resumo que ensina a matéria inteira, ou que só repete o título.
- Fonte de "prática" que é só leitura. Prática exige que a pessoa faça algo.
- Links de busca, de login, de vídeo sem autoria clara, de páginas que mudam
  toda semana ou com parâmetros de rastreamento.
- Subtópicos que só copiam o sumário de um livro. Prefira o que a pessoa
  precisa saber nomear e fazer.
