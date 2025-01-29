"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filePath = void 0;
// Importa as bibliotecas necessárias
const usu_rioService_1 = require("./services/usu\u00E1rioService");
const csvService_1 = require("./services/csvService");
const usu_rioService_2 = require("./services/usu\u00E1rioService");
// Caminho padrão para escrever o csv
//importa o path para obter o caminho do arquivo
const path = require('path');
// resolve possiveis problemas com o caminho
const absolutePath = path.resolve(__dirname, 'index.js');
// cria uma propriedade para receber o caminho
let path_empty = '';
// verifica se o caminho fornecido tem o 'dist' se tiver ele atribui o valor de '../data/usuarios.csv'
// para o path_empty, caso contrário ele atribui o valor de './data/usuarios.csv'
// essa verificação é nececssário porque o caminho para achar o arquivo de csv não funciona nos dois
// noca caso com o mesmo caminho o index.js pode não achar o arquivo e o index.ts pode e vice-versa
// essa configuração elimina esse problema
if (absolutePath.includes("dist")) {
    path_empty = '../data/usuarios.csv';
}
else {
    path_empty = './data/usuarios.csv';
}
// agora ele atribui o valor de path_empty para o filePath
exports.filePath = path_empty;
//  AVISO: SE POR ALGUM MOTIVO O ARQUIVO CSV FOR ALTERADO MANUALMENTE DURANTE A EXECUÇÃO DESDE CÓDIGO OU ATÉ MESMO DELETADO, O CÓDIGO VAI QUEBRAR
//  VISTO QUE A FUNÇÃO QUE GARANTE A INTEGRIDADE É CHAMADA APENAS UMA VEZ DURANTE O CÓDIGO. NA ESTRUTURA LÓGICA DO CÓDIGO NÃO É POSSÍVEL FAZER COM QUE
//  CSV SEJA ALTERADO DE MANEIRA INDEVIDA
// Função principal que chamas as demais
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Verifica se o arquivo csv já existe
        (0, csvService_1.csvExiste)();
        // Pergunta o usuário se ele quer logar no sistema
        while (true) {
            const logar = (yield (0, usu_rioService_2.questionAsync)("Deseja logar no sistema?(S/N): ")).toLowerCase();
            if (logar == "s") {
                while (true) {
                    // Ele pede os dados para logar(Email/Senha) e Compara pra ver se existe um usuário correspondete
                    console.log("Olá, Por favor forneça os dados para logar no sistema");
                    const Email = yield (0, usu_rioService_2.questionAsync)("Email: ");
                    // Caso Email fornecido seja vazio ele ignora manda um aviso e ignora o resto do while, fazendo novamente a mesma pergunta
                    if (!Email) {
                        console.log("O campo não pode permanecer vazio");
                        continue;
                    }
                    const Senha = yield (0, usu_rioService_2.questionAsync)("Senha: ");
                    // Mesmo coisa que acontece no email, só que para a senha  
                    if (!Senha) {
                        console.log("A senha não pode ficar vazia, insira os dados novamente");
                        continue;
                    }
                    // Chama a função que irá verificar se o usuário existe e qual categoria pertence (Adminstrador/Professor/Convidado)
                    switch ((0, csvService_1.retornarUsuarios)(exports.filePath, Email, Senha)) {
                        // Adminstrador a função retorna "1"
                        case "1": {
                            while (true) {
                                console.log("O que deseja fazer?:");
                                console.log("1: Escrever usuário");
                                console.log("2: Listar Usuarios");
                                console.log("3: Listar usuarios por id");
                                console.log("4: Alterar usuarios por id");
                                console.log("5: Deletar usuários por id");
                                console.log("6: Deslogar do sistema");
                                const opcao = yield (0, usu_rioService_2.questionAsync)(":");
                                switch (opcao) {
                                    case "1": {
                                        yield (0, usu_rioService_1.cadastrarUsuário)();
                                        continue;
                                    }
                                    // Chama a função que retonar todos os registros do CSV
                                    case "2": {
                                        (0, csvService_1.listarTodosUsuários)(exports.filePath);
                                        continue;
                                    }
                                    // Chama a função que retorna apenas um registro, se houver, utiliazando a UUID para selecionar
                                    case "3": {
                                        yield (0, csvService_1.listarUsuario)(exports.filePath);
                                        continue;
                                    }
                                    // Chama a função que permite alterar dados dos usuário exceto do Marco
                                    case "4": {
                                        yield (0, csvService_1.alterUsuario)(exports.filePath);
                                        continue;
                                    }
                                    // Chama a função que permite deletar usuário desde que ele não seja o Marco
                                    case "5": {
                                        yield (0, csvService_1.deletarUsuario)(exports.filePath, Email, Senha);
                                        continue;
                                    }
                                    // Sai deste loop
                                    case "6": {
                                        break;
                                    }
                                    // Caso o valor fonecido não corresponda a nenhuma das opções, envia uma mensagem de aviso e volta novamente para o começo
                                    default: {
                                        console.log("Opção inválida, por favor insira uma opção válida!!!");
                                        continue;
                                    }
                                }
                                break;
                            }
                            break;
                        }
                        // Convidado e Professor retornam as mesmas opções
                        case "2": {
                            while (true) {
                                // Mostra as opões disponiveis para o Usuário com este Papel: Administrador
                                console.log("O que deseja fazer?:");
                                console.log("1: Listar Usuarios");
                                console.log("2: Listar usuarios por id");
                                console.log("3: Deslogar do sistema");
                                const opcao = yield (0, usu_rioService_2.questionAsync)(":");
                                switch (opcao) {
                                    // Chama a função que retonar todos os registros do CSV
                                    case "1": {
                                        (0, csvService_1.listarTodosUsuários)(exports.filePath);
                                        continue;
                                    }
                                    // Chama a função que retorna apenas um registro, se houver, utiliazando a UUID para selecionar
                                    case "2": {
                                        yield (0, csvService_1.listarUsuario)(exports.filePath);
                                        continue;
                                    }
                                    // Encerra este while
                                    case "3": {
                                        break;
                                    }
                                    // Caso o valor fonecido não corresponda a nenhuma das opções, envia uma mensagem de aviso e volta novamente para o começo
                                    default: {
                                        console.log("Opção inválida, por favor insira uma opção válida!!!");
                                        continue;
                                    }
                                }
                                break;
                            }
                            break;
                        }
                    }
                    break;
                }
                // Sai da função caso a opção escolhida seja "n"        
            }
            else if (logar == "n") {
                usu_rioService_2.rl.close();
                break;
                // Invia um aviso de comando não reconhecido e faz novamente a pergunta
            }
            else {
                console.log("Comando não reconhecido, por favor tente novamente");
            }
        }
    });
}
// Chama a função Principal
main();
