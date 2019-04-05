# Sobre #
Esse projeto tem como objetivo mapear as palavras mais usadas em letras de canções dos gêneros mais populares no Brasil, ex: Funk, Samba, Sertanejo, etc.

Os dados para análise são obtidos do site Letras.mus.br. Através do site é possível acessar um índice com as 1000 músicas mais populares de um determinado gênero.

O script foi criado usando NodeJs e processo é bem simples. Fazemos o scrapping das páginas para obter as letras de cada uma das 1000 músicas e depois agrupamos todas as palavras para obter o número de ocorrências. Um filtro de `stopwords` é aplicado para remover algumas palavras irrelevantes.

### Executando o script ###
Os seguintes parâmetros são necessários para a execução do script: 

```
--url: Url para realizar o processo de scrapping.
--baseDir: Usado como base para criar a estrutura de pastas dentro da raíz "data".
--interval: Intervalo entre cada requisição http para evitar que o IP do usuário bloqueado em caso de muitos requests simultâneos.
```
Executar o script:
```
npm run start -- --url=https://www.letras.mus.br/mais-acessadas/sertanejo --baseDir=sertanejo --interval=1000
```

### Resultados ###
Os resultados da operações serão armazenados na pasta `data` gerada.

Arquivos:  
`words.json` : JSON contendo todas as palavras encontradas, agrupadas pela frequência e ordenadas de forma decrescente  
`songs.json` : Array contendo a lista de canções analisadas  
`README.md` : Arquivo contendo os detalhes das 50 principais palavras e a lista de canções.  
 
### TO DOs ###
- [ ] Improve stopwords list
- [ ] Improve main script logic
- [ ] Improve args handling
- [ ] Make code 100% async
- [ ] Add data vizualization ?
- [ ] Add frontend UI ?
- [ ] Make repository public
