<h1 align="center">
  Stock App
  <br>
</h1>

<b>Boas vindas ao repositório do Stock App!</b> Este projeto é uma API para um aplicativo de compra e venda de ações, desenvolvida no âmbito do processo seletivo da XP para os alunos da Trybe - Turma XP. Com a aplicação rodando, é possível criar um conta na corretora fictícia, depositar ou sacar quantias, negociar ações e verificar seu histórico de transações. O projeto foi desenvolvido em TypeScript, utilizando Node.js, Express e SequelizeORM para a administração do banco de dados.  

# Instalação

Os serviços responsáveis pelo funcionamento local do projeto foram orquestrados com docker-compose. Assim, para rodar este projeto localmente:

1. Clone o repositório e entre na pasta do projeto:
  - `cd stock-app`

2. Instale as dependências do projeto:

  - `npm install`

3. Renomeie o arquivo .env.example para .env, permitindo assim o uso das variáveis de ambiente pela biblioteca dotenv.

4. Rode o comando para subir os conteineres do node e do banco de dados por meio do docker-compose. <b>Certifique-se de que não há nenhum serviço rodando na porta 3000 e na porta 5432 (postgres)</b>:

  - `docker-compose up --build -d`

5. Sua aplicação estará rodando na porta 3000!


6. Para realizar os testes unitários da aplicação, rode o script para teste ou, se preferir, para cobertura de teste, respectivamente:

  - `docker exec -it stock-app npm test`
  - `docker exec -it stock-app npm run test:coverage`


# Deploy e documentação completa

A documentação completa da API foi feita de acordo com as especificações Open API, e está disponível para visualização por meio da User Interface do <b>Swagger</b> neste <b>[link](https://andrewerk-stock-app.herokuapp.com/docs/)</b>. As requisições feitas pela interface estão rodando no banco de dados em nuvem.

Foi feito o deploy do projeto utilizando o Heroku para a aplicação e o Supabase para hostear o banco de dados. O deploy conta com um <b>pipeline CI/CD</b>, com todo push ao repositório do GitHub sendo verificado por meio de <b>GitHub Actions</b> que rodam os testes unitários e teste de padronização e semântica do ESlint. Após a conclusão com sucesso das actions, o Heroku identifica o novo deploy e refaz o build da aplicação, subindo a nova versão para o ambiente de produção.

Como a conta em que foi realizado o deploy no heroku é gratuita, a aplicação entre em <b>"Sleep mode"</b> após uma hora de inatividade. Assim, o <b>primeiro acesso a documentação ou requisição direta à API pode demorar até 30 segundos para retornar</b>. As requisições subsequentes terão retorno mais rápido

# Características importantes do funcionamento da aplicação

<details>
  <summary>Valores das ações em tempo real</summary><br />

O sistema consome uma API externa, o [Finnhub](https://finnhub.io/), para obter os valores atualizados das ações. Assim, duas variáveis de ambiente são importantes para essa configuração. A variável API_TOKEN é um <b>token pessoal gratuíto</b>, feito apenas para o contexto desse projeto, e está sendo disponibilizada aqui para permitir o teste da aplicação. No entanto, <b>ressalta-se que disponibilizar esse tipo de informação em um repositório público não é uma boa prática e está sendo feito apenas por ser a única opção de manter o funcionamento apropriado da aplicação</b>.

A outra variável importante é a EXTERNAL_API. No arquivo de exemplo .env ela vai configurada como "true", o que significa que o sistema estará consumindo informações da API externa. Caso ocorra algum problema com a API externa, os endpoints do tipo GET para /stocks não irão retornar o currentValue da ação. Nesse caso, para ser possível testar a aplicação, <b>a variável EXTERNAL_API deverá ser trocada para "false"</b> e o projeto irá utilizar um arquivo de backup para manter o sistema em funcionamento. Nesse caso, as únicas ações que poderão ser pesquisadas ou compradas são as que constam no arquivo "/utils/mainStocks".
</details>

<details>
  <summary>Sobre a quantidade de ativos disponíveis para compra e venda</summary><br />

Como não foi disponibilizada um banco ou API específica para a realização deste projeto, foi feito um metodo simples de randomização da quantidade de ações disponíveis na corretora para a venda. Este método, disponível no arquivo /src/utils/randomQuantity.ts, é chamado pela camada de serviços "StockService".

A randomização de quantidade de ativos de uma ação em específica é realizada <b>apenas uma vez depois do banco ser inicializado</b>, no momento em que esta ação é passada como parâmetro para o método getStock pela primeira vez (este método é chamado quando uma ação é pesquisada ou comprada). As próximas vezes em que este método  for chamado com a mesma ação, ele<b> não irá sobrescrever a quantidade de ativos gerada e inserida no banco de dados anteriormente</b>. Ou seja, uma vez que a aplicação é inicializada com o banco resetado e a ação da XP é pesquisada por meio do endpoint /stocks, se for gerado um número aleatório de 100 ativos da XP, essa será a quantidade que a corretora terá e que poderá ser negociada no sistema.
</details>

<details>
  <summary>Arquitetura da aplicação</summary><br />

A API foi construída utilizando a arquitetura <b>MSC - Model, Service e Controller</b>. 

A camada de <b>controller</b> é reponsável por receber a requisição dos routers, extrair as informações que vem com a requisição (parâmetros e corpo da requisição), chamar os métodos da camada de service com os parâmetros recebidos, e retornar a resposta aos routers.

A camada de <b>service</b> é resposável por solicitar as informações do banco de dados e pela validação e aplicação das regras de negócio. Por exemplo, um cliente não pode comprar uma ação se não tiver dinheiro em conta suficiente ou se a corretora não tiver ações disponíveis. Assim, a camada de service irá gerar uma exceção que será retornada na requisição com o motivo de ter sido gerada. A camada de service <b> também é responsável por solicitar informações para a API externa utilizada (arquivo stockApiService)</b>

Por fim, a camada de <b>Model</b> é responsável pela administração do banco de dados. Para este projeto, foi utilizado o Sequelize, ORM de Node.js para o gerenciamento de bancos de dados relacionais, como o Postgres e o SQL. A configuração deste projeto utiliza o postgres, que pode ser hosteado gratuitamente pelo [Supabase](https://supabase.com/) em nuvem.

Em cada camada existem arquivos responsáveis pelo "eixo" do sistema: users, login, conta(account), carteira de investimentos(investmentPortfolio), histórico de transações(trade) e ações (stocks).

O Projeto também possui <b>middlewares</b>, que avaliam as requisições antes de chegar nos controladores. Os middlewares têm a função de:  validar o corpo das requisições com a biblioteca [Joi](https://joi.dev/api/) e gerar exceções, caso necessário; manipulação de erros e exceções, tanto geradas propositalmente quanto do sistema; validação do token enviado na requisição.


</details>

<details>
  <summary>Validação de Token JWT e hash das senhas</summary><br />

O projeto utiliza, para autorizar requisições, o <b>Token JWT</b>. A biblioteca permite que seja gerado um token, que envia em seu payload informações pré selecionadas. Nesse caso, o payload do token carrega o id da pessoa usuária e o email. Esse token é expirado 50 minutos após ser gerado, durante login ou quando um usuário é criado no sistema. <b>Todas as rotas, exceto a de login e criar usuário</b>, necessitam que seja enviado um token para ser autorizada e também para passar ao backend as informações de qual pessoa usuária está realizando a requisição. O token deve ser enviado nos headers, na chave "authorization", e na interface gráfica do Swagger ele pode ser inserido no cadeado verde que se encontra na parte superior - direita da página.

Além do token JWT, a senha cadastrada pela pessoa usuária passa por um <b>algorítmo de Hash</b> antes de ser armazenada no banco de dados. Esse algorítmo, proveniente da biblioteca <b>bcrypt</b>, é aplicado no UserModel e verificado quando a pessoa usuária faz login na camada de loginService.
</details>

<details>
  <summary>Uso da aplicação</summary><br />

Com o intuito de <b>melhorar a usabilidade do sistema e facilitar as requisições de um possível frontend</b> à aplicação, algumas alterações foram feitas na estrutura do corpo das requisições. 

O desafio solicitava inicialmente que fosse enviado o código do usuário no corpo das requisições do tipo POST, na compra e venda de ações. <b>Ao invés de enviar essa informação pelo body da requisição, essa informação está sendo enviada no payload do token</b>. Assim, a informação é enviada criptografada e facilita o uso da aplicação.

Outra alteração foi a do <b>código do ativo</b>. Essa informação consta no sistema como <b>"symbol"</b>, e equivale ao símbolo oficial único da ação. Por exemplo, o símbolo de ações da Apple é "AAPL". Assim, as ações são identificadas no banco de dados e requisições por este símbolo, para facilitar a pesquisa da pessoa usuária com um termo padronizado mundialmente e não exclusivo do sistema. Como consequência, o <b>código do ativo solicitado inicilamente como um integer é uma string neste sistema</b>.

</details>

<details>
  <summary>Carteira de investimentos e Histórico de negociações</summary><br />


O funcionamento da carteira de investimentos dos usuários está baseada nos arquivos do tipo <b>InvestmentPortfolio</b>. Para cada ação que uma pessoa usuária tiver, independente do numero de ativos, haverá um "id". Por exemplo, na carteira de investimentos de uma pessoa usuária, pode ter ações da Apple, com 50 ativos e "id" igual a 1, e ações da XP, com 50 ativos e "id" 2, enquanto outra pessoa usuária pode ter 40 ativos da Apple e o "id" igual a 3. Ou seja, este id identifica a combinação pessoa usuária com ação específica.<b> É importante não confundir esse "id" com o código do ativo mencionado na especificação do desafio</b>, uma vez que este é substituido pela variável "symbol". 

<b>Toda negociação de ativos fica registrada no banco de dados</b>, identificado por um id da transação. Este registro mantém a quantidade negociada, o valor da ação no momento da negociação, o tipo de negociação (compra ou venda), data, e o "portfolioId" (identificação da ação na carteira de investimentos da pessoa usuária).

</details>

<details>
  <summary>Lógica das Transações</summary><br />


Quando é solicitada a compra de uma ação, a seguinte sequência de ações ocorre:

1 - A função getStock do stockApiService é chamada para a consulta do valor atual da ação na API externa;

2 - É inicializada uma Transaction do sequelize: tudo que ocorrer no escopo dessa transação será desfeito caso alguma das funções chamadas lance alguma exceção;

3 - Dentro da transaction: tenta realizar uma operação de saque da conta. Se não houver a quantia suficiente, lançará uma exceção;

4 - Dentro da transaction: tenta retirar esses ativos da corretora. Se a corretora não possuir ativos suficiente, lançará uma exceção;

5 - Dentro da transaction: atualiza o numero de ativos ou cria um novo registro na carteira de investimentos;

6 - Dentro da transaction: é registrada a movimentação na tabela de negociações (TradeModel);

7 - Por fim, se nenhum erro for lançado dentro da transaction, é feito o <b>"commit"</b> das alterações no banco de dados.

</details>

<details>
  <summary>Banco de dados</summary><br />


O Diagrama Entidade Relacionamento na sequência ilustra a estrutura do banco de dados da aplicação.

<img src="./er-diagram.png" alt="Diagrama Entidade Relacionamento" width="800">

</details>

<details>
  <summary>Tecnologias utilizadas</summary><br />


As tecnologias utilizadas neste projeto foram:

- TypeScript;
- Express;
- Node.js;
- Sequelize e biblioteca auxiliar sequelize-typescript;
- Postgres;
- Docker e docker-compose;
- Joi (para validações);
- bcrypt para o hash da senha no banco de dados;
- JWT para o token de autorização das requisições;
- Mocha, Chai, Sinon, Supertest para os testes unitários;
- nyc para cobertura de testes;



</details>

<details>
  <summary>Glossário</summary><br />


Como o código esta escrito todo em inglês, segue um pequeno glossário para tornar o projeto mais acessível e facilitar a compreensão.

- Stock, stockSymbol ou symbol: Se refere a alguma ação ou seu simbolo, por exemplo, AAPL, XP, MSFT, etc;
- Asset: Se refere à ativos;
- StockQuantity ou quantity: se refere à quantidade de ativos;
- Trade: negociações
- InvestmentPortfolio ou apenas Portfolio - Carteira de investimentos
- Current Value: valor atual da ação (preço unitário)
</details>
