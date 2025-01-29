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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rl = void 0;
exports.questionAsync = questionAsync;
exports.cadastrarUsuário = cadastrarUsuário;
const readline = require('readline');
const usu_rio_1 = require("../models/usu\u00E1rio");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const csvService_1 = require("./csvService");
const date_fns_1 = require("date-fns");
// Linha de leitura
exports.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Função que fez a comunicação com a interface
function questionAsync(query) {
    return new Promise((resolve) => {
        exports.rl.question(query, (input) => {
            resolve(input);
        });
    });
}
function validarData(Data_fornecida) {
    let D = new Date(Data_fornecida);
    if (isNaN(D.getDate())) {
        return new Date((0, date_fns_1.format)(new Date(), "yyyy-MM-dd"));
    }
    return D;
}
// Função que recebera as informações para cadastrar o usuário
function cadastrarUsuário() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = {
                UUID: (0, uuid_1.v4)(),
                Nome: yield questionAsync("Insira um Nome: "),
                Email: yield questionAsync("Insira um Emal: "),
                Papel: (yield questionAsync("Insira o Papel: ")) || "Convidado",
                Senha: yield questionAsync("Insira uma Senha: "),
                dataCadastro: validarData(yield questionAsync("Insira a Data de Cadastro: ")),
                dataAlteracao: validarData(yield questionAsync("Insira a Data de Alteração: ")),
                Status: yield questionAsync("Insira o Status(Ativo/Inativo): ")
            };
            // Usa o bcrypt para Criptografar a senha
            user.Senha = yield bcrypt_1.default.hash(user.Senha, 10);
            const userFinal = usu_rio_1.usuarioSchema.parse(user);
            // Se não houver erro escreve as credências em um CSV, mas antes
            // Verifica se o Email ou UUID passados já não existem no CSV
            (0, csvService_1.escreverCSV)("usuarios.csv", userFinal);
        }
        catch (err) {
            console.log("Erro na hora de validar os dados passsados!:  ", err);
            return;
        }
    });
}
