ATENÇÃO, NÃO CONSEGUI FAZER O READLINE RODAR EM TYPESCRIPT.
ELE ESCREVE NO TERMINAL E AGUARDA UMA RESPOSTA, MAS APÓS
DIGITAR QUALQUER TECLA ELE DÁ UM 'Restarting...' e volta
novamente na pergunta, por favor execute o index.js nas pasta dist.



Execute o index.js

///////////////INSTRUÇÕES PARA LOGAR///////////////////////////////

Usuário máximo: Marcos
Senha do usuário máximo: Marcos123$%
Email do usuário máximo: marcos@gmail.com
O código pede o email e a senha para então logar.

///////////// O QUE O CÓDIGO FAZ?/////////////////////////////////
Ele cadastra usuários, altera os dados usuários, deleta usuários.
Dependendo do nível de permissão do usuário.
Ele gera por padrão um usuário máximo, que não pode ser alterado ou apagado.


///////////////INSTRUÇÕES SOBRE O COMPORTAMENTO DO SOFTWARE////////
Observações: Os status('inativo'/'ativo') são meramente ilustrativos, não têm interferência
funcional no código. Alguns campos como inserir data podem ser pulados
pressionando enter, logo então ele pega a data atual e coloca como padrão.
se for alterar alguma dado de um usuário e pressionar enter sem preecher o
campo, ele usa os dados antigos nos campos que permaneceram vazios.
caso algum dado seja fornecido de maneira errada, ele retornará um erro
e as alterações serão descartadas por completo.
'Convidado' e 'Professor' tem exatamente os mesmo nivel de acesso no sistema;