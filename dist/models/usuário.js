"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioSchema = void 0;
const zod_1 = require("zod");
const papeis_1 = require("./papeis");
const papeis_2 = require("./papeis");
// Utiliza o zod para criar um modelo para o usuário
exports.usuarioSchema = zod_1.z.object({
    UUID: zod_1.z.string().uuid(),
    Nome: zod_1.z.string().min(3).max(25),
    Email: zod_1.z.string().email(),
    Senha: zod_1.z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%¨&*()<>:?;]/),
    Papel: zod_1.z.nativeEnum(papeis_1.Papel),
    dataCadastro: zod_1.z.date(),
    dataAlteracao: zod_1.z.date(),
    Status: zod_1.z.nativeEnum(papeis_2.Status)
});
