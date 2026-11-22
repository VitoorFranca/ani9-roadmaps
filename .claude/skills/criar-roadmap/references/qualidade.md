# Revisão final

Antes de relatar, confira cada item. Se um item falhar, corrija a semente.

## Escopo

- [ ] O destino é uma frase sobre o que a pessoa vai conseguir fazer, e dá
      para conferir.
- [ ] De 4 a 12 marcos, em ordem: cada um depende só dos anteriores, e o
      último chega ao destino.
- [ ] Um profissional da área não sentiria falta de nada essencial para o
      destino, e nada obsoleto ou de nicho está entre os marcos.
- [ ] `out` diz o que alguém esperaria encontrar e ficou de fora.
- [ ] A pessoa que pediu concordou com o escopo antes de o módulo ser escrito.

## Primeiro módulo

- [ ] Uma pessoa do público suposto consegue começar pelo primeiro passo sem
      precisar de algo que só aparece depois.
- [ ] De 3 a 8 passos, cada um uma coisa só; cerca de uma a duas semanas.
- [ ] Ao fim do módulo, o primeiro marco foi alcançado (`closes`).
- [ ] Toda escolha entre opções tem `choice: true`, uma `recomendado` e as
      outras `alternativa`; o que não trava o caminho está `opcional`.
- [ ] Só existe um módulo no arquivo. Os outros são do tutor.

## Texto

- [ ] Todo passo tem um parágrafo próprio: o que é e por que importa ou quando
      se usa.
- [ ] Os resumos não seguem uma fórmula repetida; nenhum ensina a matéria
      inteira nem repete o título.
- [ ] Os títulos são curtos, específicos, únicos e usam o termo da área.
- [ ] Português correto, sem jargão desnecessário e sem promessa de resultado.
- [ ] Nada foi copiado de outro roadmap (textos, listas de passos, listas de
      fontes).

## Objetivos e critérios

- [ ] Todo passo tem objetivos que começam por um verbo observável.
- [ ] Todo passo tem de 2 a 4 critérios que dá para verificar numa conversa
      por escrito, e o `expect` de cada um traz pontos concretos.
- [ ] Nenhum critério pede para decorar ou reconhecer.
- [ ] Nenhum `expect` afirma algo que as fontes do passo não sustentam.
- [ ] Os ids são estáveis e únicos.

## Fontes

- [ ] Todo passo tem ao menos uma fonte própria, que trata dele (não a página
      inicial do site, nem a fonte do módulo).
- [ ] O módulo tem teoria e prática; as fontes de prática exigem fazer algo.
- [ ] Toda fonte tem `format`, e predominam fontes oficiais e gratuitas.
- [ ] Na saída de `--titles`, cada página é mesmo sobre o seu passo.
- [ ] `node scripts/validate.mjs models/<chave>.json --titles` terminou com
      "Sem erros.".
