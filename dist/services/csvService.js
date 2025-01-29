"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escreverCSV = escreverCSV;
exports.listarTodosUsuários = listarTodosUsuários;
exports.listarUsuario = listarUsuario;
exports.deletarUsuario = deletarUsuario;
exports.alterUsuario = alterUsuario;
exports.retornarUsuarios = retornarUsuarios;
exports.csvExiste = csvExiste;
const fs_1 = __importDefault(require("fs"));
const json2csv = __importStar(require("json2csv"));
const usu_rio_1 = require("../models/usu\u00E1rio");
const papaparse_1 = __importDefault(require("papaparse"));
const zod_1 = require("zod");
const usu_rioService_1 = require("./usu\u00E1rioService");
const papeis_1 = require("../models/papeis");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_2 = require("uuid");
// AVISO RELEVANTE
// Usa a biblioteca do json2csv para transcrever os objetos-jsons criados
// Para um csv para só então salva-los usando o fs
// Usa a biblioteca do papaparse para transformar arquivos csv em json
//
// Função para escrever no CSV
function escreverCSV(fileName, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fs_1.default.existsSync(fileName)) {
            const csv = fs_1.default.readFileSync(fileName, 'utf8');
            const cvsToZod = papaparse_1.default.parse(csv, {
                header: true,
                dynamicTyping: true
            }).data;
            const user_cadastro = usu_rio_1.usuarioSchema.parse(user);
            const cadastrados = zod_1.z.array(usu_rio_1.usuarioSchema).parse(cvsToZod);
            for (const cadastro of cadastrados) {
                if (cadastro.UUID === user_cadastro.UUID) {
                    console.log("Esta UUID já está sendo usada:", user_cadastro.UUID);
                    return;
                }
                else if (cadastro.Email === user_cadastro.Email) {
                    console.log("Este Email já está sendo usado:", user_cadastro.Email);
                    console.log("Usuário descartado...");
                    return;
                }
            }
            console.log("Usuário validado com Sucesso!!!");
            console.table([user]);
            cvsToZod.push(user);
            const csv2 = yield json2csv.parseAsync(cvsToZod, { header: true });
            fs_1.default.writeFileSync(fileName, csv2, "utf8");
        }
        else {
            const csv = yield json2csv.parseAsync(user, { header: true });
            fs_1.default.writeFileSync(fileName, csv, "utf8");
        }
    });
}
// Função para listar todos os Usuários
function listarTodosUsuários(filePath) {
    try {
        let records = [];
        const csv = fs_1.default.readFileSync(filePath, "utf-8");
        const csvObject = papaparse_1.default.parse(csv, { header: true,
            dynamicTyping: true }).data;
        for (const csv of csvObject) {
            records.push(csv);
        }
        console.table(records);
    }
    catch (err) {
        console.log("Caminho não encontrado ou arquivo inexistente:", err);
    }
}
// Lista os Usuários por UUID
function listarUsuario(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const csv = fs_1.default.readFileSync(filePath, "utf-8");
        // converte um json
        const csvObject = papaparse_1.default.parse(csv, { header: true,
            dynamicTyping: true
        }).data;
        try {
            // Recebe a UUID
            let uid = (yield (0, usu_rioService_1.questionAsync)("Por favor forneça uma UUID válida: ")).toString();
            // Percorre o arquivo csv
            for (const csvv of csvObject) {
                // Caso ache um usuário correspondente o retorna
                if (usu_rio_1.usuarioSchema.parse(csvv).UUID === uid) {
                    console.table([csvv]);
                    return;
                }
            }
            console.log("Nenhum Usuário encontrado com a UUID fornecidas");
        }
        catch (err) {
            //Retorna um erro indicado integridado dos arquivos CSV comprometida
            console.log("Erro durante a listagem de usuários, possivelmente relacionado a integridade do arquivo CSV");
        }
    });
}
// Deletar usuário selecionado por UUID
function deletarUsuario(filePath, email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const csv = fs_1.default.readFileSync(filePath, "utf-8");
        const csvObject = papaparse_1.default.parse(csv, { header: true,
            dynamicTyping: true
        }).data;
        const user_cadastro = zod_1.z.array(usu_rio_1.usuarioSchema).parse(csvObject);
        try {
            let uid = (yield (0, usu_rioService_1.questionAsync)("Por favor forneça uma UUID válida: ")).toString();
            // verifica se a UUID não pertence ao usuário máximo Marcos
            for (const user of user_cadastro) {
                if (user.Email === "marcos@gmail.com" && user.UUID === uid && user.Email === email) {
                    console.log("Não é possivel deletar este usuário por motivos de integridade!");
                    return;
                }
            }
            // Caso não seja o Marcos ele faz novamente a varredura
            for (const user of user_cadastro) {
                if (user.UUID == uid) {
                    const index = user_cadastro.indexOf(user);
                    user_cadastro.splice(index, 1);
                    console.log("Usuário deletado com Sucesso!!!\n #");
                    console.table([user]);
                    console.log("#\n");
                    console.log("*\n");
                    console.log("Usuários Atuais:\n *");
                    console.table(user_cadastro);
                    console.log("*");
                    const cvs2 = yield json2csv.parseAsync(user_cadastro, { header: true });
                    fs_1.default.writeFileSync(filePath, cvs2, "utf8");
                }
            }
        }
        catch (err) {
            console.log(err);
            return;
        }
        finally {
            return;
        }
    });
}
// Função para alterar o valor de algum atributo do Usuário
function alterUsuario(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // função para validar status
        function validarStatus(status_atual, status_antigo) {
            if (status_atual === "Ativo") {
                return "Ativo";
            }
            else if (status_atual === "Inativo") {
                return "Inativo";
            }
            else if (status_atual == "") {
                return status_antigo;
            }
            else {
                console.log("Status Incorreto, voltando ao status anterior");
                return status_antigo;
            }
        }
        // Função para validar Email, ele procura para ver se o email alterado tem mais de um ocorrência
        function validarEmail(email, userUUID) {
            if (email != "") {
                try {
                    // compara o atributo do usuarioSchema
                    usu_rio_1.usuarioSchema.partial(email);
                    let emails = 0;
                    for (const u of user_cadastro) {
                        if (u.Email == email && u.UUID != userUUID) {
                            emails += 1;
                        }
                    }
                    if (emails >= 1) {
                        console.log("Já existe usuário associado a este email: ", email);
                        console.log("Voltando ao email anterior");
                        return;
                    }
                    console.log("Nenhum email igual encontrado");
                    return email;
                }
                catch (_a) {
                    //caso o email seja fornecido de maneira incorreta
                    console.log("As dados fornecidas no campo Email não são reconhecidos como 'Email'");
                    return;
                }
            }
        }
        // Lê o arquivo csv
        const csv = fs_1.default.readFileSync(filePath, "utf-8");
        // transforma em um Json com p papaparse
        const csvObject = papaparse_1.default.parse(csv, { header: true,
            dynamicTyping: true
        }).data;
        // Cria uma lista com o tipo a ser recebido
        const user_cadastro = zod_1.z.array(usu_rio_1.usuarioSchema).parse(csvObject);
        try {
            // Propriedade para Receber a UUID
            let uid = (yield (0, usu_rioService_1.questionAsync)("Forneça a UUID para editar o usuário: "));
            // For para comparar se o usuário a ser alterado não possui o email marcos@gmail.com
            for (const user of user_cadastro) {
                // caso seja retorna mensagem de aviso e encerra a função
                if (user.Email === "marcos@gmail.com" && user.UUID === uid) {
                    console.log("Não é possivel alterar este usuário por motivos de integridade!");
                    return;
                }
            }
            {
                // Caso o usuário a ser alterado realmente não seja o marcos e exista no Arquivo csv ele permite alterações
                for (const user of user_cadastro) {
                    if (user.UUID == uid) {
                        // Pede que o Adiministrado logado informe as novos atributos do usuário
                        const usuerAlterado = {
                            UUID: user.UUID,
                            Nome: (yield (0, usu_rioService_1.questionAsync)("Insira um Nome: ")) || user.Nome,
                            Email: validarEmail(yield (0, usu_rioService_1.questionAsync)("Insira um Email: "), user.UUID) || user.Email,
                            Papel: (yield (0, usu_rioService_1.questionAsync)("Insira o Papel: ")) || user.Papel,
                            Senha: (yield (0, usu_rioService_1.questionAsync)("Insira uma Senha: ")) || user.Senha,
                            dataCadastro: user.dataAlteracao,
                            dataAlteracao: new Date(),
                            Status: validarStatus(yield (0, usu_rioService_1.questionAsync)("Insira o Status(Ativo/Inativo):"), user.Status)
                        };
                        // Pergunta se o Administrador logado deseja salvar as alterações
                        const salvar = (yield (0, usu_rioService_1.questionAsync)("Desaja salvar as alterações?(S/N) ")).toLowerCase();
                        //caso sim ele salva
                        if (["s", "y", "yes", "sim"].includes(salvar)) {
                            const nUser = usu_rio_1.usuarioSchema.parse(usuerAlterado);
                            user.Nome = nUser.Nome;
                            user.Email = nUser.Email;
                            user.Papel = nUser.Papel;
                            user.Senha = yield bcrypt_1.default.hash(nUser.Senha, 10);
                            user.dataCadastro = nUser.dataCadastro;
                            user.dataAlteracao = nUser.dataAlteracao;
                            user.Status = nUser.Status;
                            console.log("Alterações salvas");
                            break;
                        }
                        //caso não
                        else if (["n", "not", "no", "não", "nao"].includes(salvar)) {
                            console.log("Alterações descartadas");
                            break;
                            //digitar algum comando não reconhecido ele não salva as alterações
                        }
                        else {
                            console.log("Comando não reconhecido, descartando alterações");
                            break;
                        }
                    }
                }
            }
            // transforma o json em um csv
            const cvs2 = yield json2csv.parseAsync(user_cadastro, { header: true });
            // Salva as alterações em um csv
            fs_1.default.writeFileSync(filePath, cvs2, "utf8");
        }
        catch (err) {
            // caso alguma informação altera não atenda as exigências estabelicidas no objeto zod
            // ele retorna um erro
            console.log("Alguma informação não atendeu os paramêtros desejados, o que ocasionou o erro: ", err);
        }
    });
}
// Verifica se o usuário existe no CSV e sua permissão
function retornarUsuarios(filePath, Email, Senha) {
    // Lê o arquivo csv
    const csv = fs_1.default.readFileSync(filePath, "utf-8");
    // Converter de csv para json com o papaparse
    const csvObject = papaparse_1.default.parse(csv, { header: true,
        dynamicTyping: true
    }).data;
    const user_cadastro = zod_1.z.array(usu_rio_1.usuarioSchema).parse(csvObject);
    //percorre a lista para ver qual o papel de quem está logando
    for (const user of user_cadastro) {
        //verifica o email e a senha
        if (user.Email === Email && (bcrypt_1.default.compareSync(Senha, user.Senha)) === true) {
            switch ((user.Papel).toString()) {
                // caso o Papel do Usuário seja Administrador
                case "Administrador": {
                    console.log("Logado Como Administrador!");
                    return "1";
                }
                // caso o Papel do Usuário seja Convidado
                case "Convidado": {
                    console.log("Logado Como Convidado!");
                    return "2";
                }
                // caso o Papel do Usuário seja Professor
                //OBS: Ele possui o mesmo nivel de acesso de Convidado
                case "Professor": {
                    console.log("Logado como Professsor!");
                    return "2";
                }
            }
        }
    }
    // Emite um aviso de que os dados podem estar incorretos
    // Ou cimplesmente não consta no arquivo CSV
    console.log("Dados incorretos ou Usuário não possui uma conta.");
}
// Verificando a Existência de um arquivo csv, caso não encontre ele cria um usuário padrão
function csvExiste(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Caso o arquivo não exista
            if (!fs_1.default.existsSync(fileName)) {
                // Emite um aviso de que não foi encontrado
                // Toma as devidas providências
                console.log("Arquivo csv não encontrado, criando um usuário padrão");
                // Cria um usuário padrão que NÃO PODE SER ALTERADO OU DELETADO
                // Ele apesar de ser igual aos outros, dentro do código
                // Ele é tratado como execessão a regra
                // Afim de manter a integridade
                const marcos = {
                    UUID: (0, uuid_1.v4)(),
                    Nome: "Marcos",
                    Email: "marcos@gmail.com",
                    Senha: "Marcos123$%",
                    Papel: papeis_1.Papel.Administrador,
                    dataCadastro: new Date(),
                    dataAlteracao: new Date(),
                    Status: "Ativo"
                };
                // Criptografa a senha
                marcos.Senha = bcrypt_1.default.hashSync(marcos.Senha, 10);
                const Marcos = usu_rio_1.usuarioSchema.parse(marcos);
                const csv = yield json2csv.parseAsync(Marcos, { header: true });
                // Salva as alterações em um csv
                fs_1.default.writeFileSync(fileName, csv, "utf8");
            }
            else {
                // Caso o arquivo CSV exista ele verifica se o Usuário "Padrão"
                // Existe no arquivo
                const marcos = {
                    UUID: (0, uuid_1.v4)(),
                    Nome: "Marcos",
                    Email: "marcos@gmail.com",
                    Senha: "Marcos123$%",
                    Papel: papeis_1.Papel.Administrador,
                    dataCadastro: new Date(),
                    dataAlteracao: new Date(),
                    Status: "Ativo"
                };
                // compara este tipo, caso falhe ele retonra um erro "catch"
                const Marcos = usu_rio_1.usuarioSchema.parse(marcos);
                // Lê um arquivo csv
                const csv = fs_1.default.readFileSync(fileName, "utf8");
                // Converte de um arquivo csv para json com o papaparse
                const csvObject = papaparse_1.default.parse(csv, {
                    header: true,
                    dynamicTyping: true
                }).data;
                // Obtém os valores dos atributos em uma lista
                const obj2 = Object.values(Marcos);
                const csvArray = zod_1.z.array(usu_rio_1.usuarioSchema).parse(csvObject);
                // Percorre todo os usuários do CSV
                for (const usuario of csvArray) {
                    // Verifica se o email existe e faz mais verificações caso exista
                    // Afim de manter a integridade
                    if (usuario.Email === "marcos@gmail.com") {
                        // Obtém os valores das chaves
                        const obj1 = Object.values(usuario);
                        // Percorre cada atributo do usuário padrão
                        for (const item of obj2) {
                            //Verifica se não é o primeiro item, no caso o UUID 
                            if (obj2.indexOf(item) != 0) {
                                // obtem o index atual
                                const indice_obj2 = obj2.indexOf(item);
                                // Isola os demais atributos e compara  Papel do usuário, juntamente com o Status
                                if (indice_obj2 != 3 && indice_obj2 != 5 && indice_obj2 != 6) {
                                    if (obj1[obj2.indexOf(item)] !== item) {
                                        // Envia a mensagem de aviso dos atributos comparados
                                        // Que não conhecidem de maneira desejada
                                        console.log("Estes dados não batem", obj1[obj2.indexOf(item)], "e", item);
                                        return;
                                    }
                                    // Caso o atributo comparado seja a senha
                                }
                                else if (indice_obj2 == 3) {
                                    // Usa o bcrypt para ver se a senha do csv condiz com os paramêtros internos
                                    // retornando true ou false
                                    if (!(yield bcrypt_1.default.compare(item, obj1[obj2.indexOf(item)]))) {
                                        // caso false ele envia a mensagem de aviso
                                        // sobre a senha que foi alterada
                                        console.log("\n Foi Vasculhado o arquivo csv, e foi identificado que a senha do Usuário Marcos foi alterada!");
                                        return;
                                    }
                                }
                                else {
                                    return;
                                }
                            }
                            else {
                                // verifica também a integridade da UUID
                                if (!(0, uuid_2.validate)(item)) {
                                    // Caso identificado anomalia
                                    // retorna um aviso sobre a UUID
                                    console.log("A UUID não é valida");
                                    return;
                                }
                            }
                        }
                    }
                    else {
                        // Caso o ele não encontre o nenhum email correspondente
                        // Ele retorna um aviso de que não foi possivel encontrar
                        // Recomenda-se Deletar o arquivo csv e deixar
                        // Que o código crie um novo do zero
                        if (csvArray.length === csvArray.indexOf(usuario) + 1) {
                            console.log("Usuário Administrador Marcos não encontrado");
                            console.log("Por favor, delete o arquivo csv, e reinicie o programa");
                            console.log("Permitindo que o programa crie um do novo arquivo csv");
                            console.log("Para que as exigências internas sejam atendidas");
                            return;
                        }
                        else {
                            continue;
                        }
                    }
                }
            }
        }
        catch (err) {
            // Ele retorna um erro caso ele falhe no processo
            // De validação do schemaUsuario
            // Indicando problema de integridade
            // Com atributos a mais ou a menos no csv
            // Ou nomeados de maneira diferente
            console.log("Um erro de integridade foi detectado:", err);
        }
    });
}
