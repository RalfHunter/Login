///////////////INSTRUÇÕES PARA LOGAR///////////////////////////////

para executar o index.ts utilize o comando: npx ts-node ./src/index.ts
para executar o index.js navegue até a pasta index.js utilize o comando: node index.js

Usuário máximo: Marco
Senha do usuário máximo: Marco123$%
Email do usuário máximo: marco@gmail.com
O código pede o email e a senha para então logar.

///////////// O QUE O CÓDIGO FAZ?/////////////////////////////////
Ele cadastra usuários, altera os dados usuários, deleta usuários.
Dependendo do nível de permissão do usuário.
Ele gera por padrão um usuário máximo, que não pode ser alterado ou apagado.


///////////////INSTRUÇÕES SOBRE O COMPORTAMENTO DO SOFTWARE////////
Observações: Os status('inativo'/'ativo') são meramente ilustrativos, não têm interferência
funcional no código. Alguns campos como inserir data podem ser pulados
pressionando enter, no campo papel caso pressione 'Enter' por padrão será 'Convidado',
se for alterar alguma dado de um usuário e pressionar enter sem preecher o
campo, ele usa os dados antigos nos campos que permaneceram vazios.
caso algum dado seja fornecido de maneira errada, ele retornará um erro
e as alterações serão descartadas por completo.
'Convidado' e 'Professor' tem exatamente os mesmo nivel de acesso no sistema;

