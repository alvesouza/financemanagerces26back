## **CES-26: [back-end] Projeto exploratório**
> Alunos: 
> Leo Gomes, Pedro Alves e Rafaella Bambokian - COMP21

### :bangbang: Proposta
Servidor para processo e armazenamento de dados:
- aquisição de dados presentes no database
- inserção de dados no database
- autenticação do login de usuários

### :computer: Desenvolvimento
Principais módulos auxiliares ao desenvolvimento front-end do projeto.
- express - framework para gerenciamento do servidor
- cors - modulo que permite a transmissão de informação entre pltaformas de origens diferentes
- http-errors - biblioteca para tratamento de erro

### :computer: Integração com o Front:
A integração com o FRONT-END foi feito por trocas de mensagens HTTP, se utilizando de rotas GET, POST, PUT e DELETE. Devido ao fato deles estarem como serviços separado, foi necessarios se utilizar da ferramenta CORS(Cross Origin Resources Sharing), pois é prática comum os servidores bloquearem requests de serviços diferentes.

A requisições foram desenhadas na lista TO-DO no [link](https://github.com/bambokianr/finance-manager-front/issues/6), com uma pequena série de modificações.

## :computer: Database:
  Código para gerar o banco [link](https://github.com/alvesouza/financemanagerces26back/blob/main/database/create_tables.sql)
  
  Foi utilizado o postgresql integrado ao Heroku, modelado com base do diagrama abaixo:
  ![alt text](https://drive.google.com/uc?export=view&id=1EORagX7qKw-QFL_G03XfFXgJlwfLVXjz)
  
### :Views e índices:
  No banco de dados, Views foram utilizadas, juntas de Indices para a melhora da eficiência do programa, como um left join para relacionar as "expenses" junto com as "tags", utilizando o indices em hash na tabela "tags", arvores binárias.

 
