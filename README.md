# Sobre #
Esse projeto tem como objetivo mapear as palavras mais usadas em letras de canções dos gêneros mais populares no Brasil, ex: Funk, Samba, Sertanejo, etc.

Os dados para análise são obtidos do site Letras.mus.br. Através do site é possível acessar um índice com as 1000 músicas mais populares de um determinado gênero.

O script foi criado usando NodeJs e processo é bem simples. Fazemos o scrapping das páginas para obter as letras de cada uma das 1000 músicas e depois agrupamos todas as palavras para obter o número de ocorrências. Um filtro de `stopwords` é aplicado para remover algumas palavras irrelevantes.

### Executando o script ###

#### Executar apenas uma URL ###
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

#### Executar uma lista de URLs ####
Existe uma segunda opção de script que pode ser usado para executar multiplas urls em sequência. 

Adicione as urls desejadas no arquivo `tasks.json` e então execute o comando a seguir:

```
npm run tasks
```

Note que o tempo de processamento será baseado no total de urls a serem buscas. O processo é executado em forma de fila e não em paralelo.

### Resultados ###
Os resultados da operações serão armazenados na pasta `data` gerada.

Arquivos:  
`words.json` : JSON contendo todas as palavras encontradas, agrupadas pela frequência e ordenadas de forma decrescente  
`songs.json` : Array contendo a lista de canções analisadas  
`README.md` : Arquivo contendo os detalhes das 50 principais palavras e a lista de canções.  
 
### TO DOs ###
- [x] Improve stopwords list
- [x] Improve main script logic
- [x] Improve args handling
- [x] Add json task list
- [x] Dynamically generate README files for each folder created
- [ ] Make code 100% async
- [ ] Add data vizualization ?
- [ ] Add frontend UI ?
- [ ] Make repository public
- [ ] Fix unit tests
