
const readline = require('readline');
import { usuarioSchema } from "../models/usuário";
import { z } from "zod";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { escreverCSV } from "./csvService";

import { format } from "date-fns";
import { filePath } from "..";
// Linha de leitura
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


// Função que fez a comunicação com a interface
export function questionAsync(query: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(query, (input:any) => {
        resolve(input);
      });
    });
  }
  function validarData(Data_fornecida:string): Date{
    
    let D: Date = new Date(Data_fornecida)
    if(isNaN(D.getDate())){
      return new Date(format(new Date(), "yyyy-MM-dd"))
    }
    return D
   
  }
  // Função que recebera as informações para cadastrar o usuário
  export async function cadastrarUsuário() {
    try{
    const user = {
        UUID: uuidv4(),
        Nome: await questionAsync("Insira um Nome: "),
        Email: await questionAsync("Insira um Email: "),
        Papel: await questionAsync("Insira o Papel(Convidado/Administrador): ") || "Convidado",
        Senha: await questionAsync("Insira uma Senha: "),
        dataCadastro: validarData(await questionAsync("Insira a Data de Cadastro: ")),
        dataAlteracao: validarData(await questionAsync("Insira a Data de Alteração: ")) ,
        Status: await questionAsync("Insira o Status(Ativo/Inativo): ")
    }
    // Usa o bcrypt para Criptografar a senha
    user.Senha = await bcrypt.hash(user.Senha, 10)
    type UsuarioFinal = z.infer<typeof usuarioSchema>

    const userFinal: UsuarioFinal = usuarioSchema.parse(user)
    
    // Se não houver erro escreve as credências em um CSV, mas antes
    // Verifica se o Email ou UUID passados já não existem no CSV

    
      escreverCSV(filePath, userFinal)
    
    }catch(err){
        console.log("Erro na hora de validar os dados passsados!:  ",err)
        return
    }
    
}
