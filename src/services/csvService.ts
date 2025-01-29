import fs from 'fs';
import * as json2csv from 'json2csv';
import { usuarioSchema } from '../models/usuário';
import Papa from 'papaparse';
import { z } from 'zod';
import { questionAsync, rl } from './usuárioService';
import { Papel } from '../models/papeis';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import { validate as isUUID} from 'uuid';

// AVISO RELEVANTE
    // Usa a biblioteca do json2csv para transcrever os objetos-jsons criados
    // Para um csv para só então salva-los usando o fs
    // Usa a biblioteca do papaparse para transformar arquivos csv em json
//

// Função para escrever no CSV
export async function escreverCSV(fileName:string, user:object){

    if(fs.existsSync(fileName)){
        const csv = fs.readFileSync(fileName, 'utf8')
        const cvsToZod = Papa.parse(csv,{
            header: true,
            dynamicTyping:true
        }).data
        
        type UserZod = z.infer<typeof usuarioSchema>
        const user_cadastro: UserZod = usuarioSchema.parse(user)
        const cadastrados: UserZod[] = z.array(usuarioSchema).parse(cvsToZod)

        for (const cadastro of cadastrados){
            if(cadastro.UUID === user_cadastro.UUID){
                console.log("Esta UUID já está sendo usada:", user_cadastro.UUID)
                return
            }
            else if(cadastro.Email === user_cadastro.Email){
                console.log("Este Email já está sendo usado:", user_cadastro.Email)
                console.log("Usuário descartado...")
                return
            }

        }
        console.log("Usuário validado com Sucesso!!!")
        console.table([user])
        cvsToZod.push(user)
        const csv2 = await json2csv.parseAsync(cvsToZod, {header:true})
        fs.writeFileSync(fileName, csv2, "utf8")
       
    }
    else{
    
    const csv =  await json2csv.parseAsync(user, {header: true})
    fs.writeFileSync(fileName, csv, "utf8")}
}

// Função para listar todos os Usuários
export function listarTodosUsuários(filePath: string){
    try{
        let records = [];
        const csv = fs.readFileSync(filePath, "utf-8")
        const csvObject = Papa.parse(csv,{header: true,
            dynamicTyping: true}).data
        for(const csv of csvObject){
            records.push(csv)
        }
        console.table(records)
    }catch(err){
        console.log("Caminho não encontrado ou arquivo inexistente:",err)
    }
}

// Lista os Usuários por UUID
export async function listarUsuario(filePath: string){
    const csv = fs.readFileSync(filePath, "utf-8")
    // converte um json
    const csvObject = Papa.parse(csv,{header:true,
        dynamicTyping:true
    }).data
    try{
    // Recebe a UUID
    let uid = (await questionAsync("Por favor forneça uma UUID válida: ")).toString()
    // Percorre o arquivo csv
    for(const csvv of csvObject){

        // Caso ache um usuário correspondente o retorna
       if(usuarioSchema.parse(csvv).UUID === uid){
        console.table([csvv])
        return
       }
    }
    console.log("Nenhum Usuário encontrado com a UUID fornecidas")
    }
    catch(err){
        //Retorna um erro indicado integridado dos arquivos CSV comprometida
        console.log("Erro durante a listagem de usuários, possivelmente relacionado a integridade do arquivo CSV")
    }

}
// Deletar usuário selecionado por UUID
export async function deletarUsuario(filePath: string, email:string, senha:string){
    const csv = fs.readFileSync(filePath, "utf-8")
    const csvObject = Papa.parse(csv,{header:true,
        dynamicTyping:true
    }).data
    type UserZod = z.infer<typeof usuarioSchema>
    const user_cadastro: UserZod[] = z.array(usuarioSchema).parse(csvObject)
    try{
    let uid = (await questionAsync("Por favor forneça uma UUID válida: ")).toString()
    // verifica se a UUID não pertence ao usuário máximo Marcos
    for(const user of user_cadastro){
        if (user.Email ==="marcos@gmail.com" && user.UUID === uid && user.Email === email){
            console.log("Não é possivel deletar este usuário por motivos de integridade!")
            return
        }
    }
    // Caso não seja o Marcos ele faz novamente a varredura
    for(const user of user_cadastro){
        if (user.UUID == uid){
            const index = user_cadastro.indexOf(user)
            user_cadastro.splice(index, 1)
            console.log("Usuário deletado com Sucesso!!!\n #")
            console.table([user])
            console.log("#\n")
            console.log("*\n")
            console.log("Usuários Atuais:\n *")
            console.table(user_cadastro)
            console.log("*")
            const cvs2 = await json2csv.parseAsync(user_cadastro,{header:true})
            fs.writeFileSync(filePath, cvs2, "utf8")
        }
    }}catch(err){
        console.log(err)
        return
    }finally{
        return
    }
}

// Função para alterar o valor de algum atributo do Usuário
export async function alterUsuario(filePath: string){
    // função para validar status
    function validarStatus(status_atual: string, status_antigo:string): string {
        if(status_atual === "Ativo"){
            return "Ativo"
        }
        else if (status_atual === "Inativo"){
            return "Inativo"
        }else if(status_atual == ""){
            return status_antigo
        }else {
            console.log("Status Incorreto, voltando ao status anterior")
            return status_antigo
        }
       
    }
    // Função para validar Email, ele procura para ver se o email alterado tem mais de um ocorrência
    function validarEmail(email: any, userUUID: string){
        if(email != ""){
            try{
                // compara o atributo do usuarioSchema
                usuarioSchema.partial(email)
                let emails: number = 0;
                for (const u of user_cadastro){
                    if(u.Email == email && u.UUID != userUUID){
                        emails += 1
                    }
                }
                if (emails >= 1){
                    console.log("Já existe usuário associado a este email: ", email)
                    console.log("Voltando ao email anterior")
                    return
                }
                console.log("Nenhum email igual encontrado")
                return email 
            }catch{
                //caso o email seja fornecido de maneira incorreta
                console.log("As dados fornecidas no campo Email não são reconhecidos como 'Email'")
                return
            }
        }

    }
    // Lê o arquivo csv
    const csv = fs.readFileSync(filePath, "utf-8")
    // transforma em um Json com p papaparse
    const csvObject = Papa.parse(csv,{header:true,
        dynamicTyping:true
    }).data
    // cria um tipo
    type UserZod = z.infer<typeof usuarioSchema>
    // Cria uma lista com o tipo a ser recebido
    const user_cadastro: UserZod[] = z.array(usuarioSchema).parse(csvObject)
    try{
    // Propriedade para Receber a UUID
    let uid = (await questionAsync("Forneça a UUID para editar o usuário: "))
    // For para comparar se o usuário a ser alterado não possui o email marcos@gmail.com
    for(const user of user_cadastro){
        // caso seja retorna mensagem de aviso e encerra a função
        if (user.Email ==="marcos@gmail.com" && user.UUID === uid){
            console.log("Não é possivel alterar este usuário por motivos de integridade!")
            return
        }
    }

    {
    // Caso o usuário a ser alterado realmente não seja o marcos e exista no Arquivo csv ele permite alterações
    for(const user of user_cadastro){
        if (user.UUID == uid){
            // Pede que o Adiministrado logado informe as novos atributos do usuário
            const usuerAlterado = {
                UUID: user.UUID,
                Nome: await questionAsync("Insira um Nome: ") || user.Nome,
                Email: validarEmail(await questionAsync("Insira um Email: "), user.UUID) || user.Email,
                Papel: await questionAsync("Insira o Papel: ") || user.Papel,
                Senha: await questionAsync("Insira uma Senha: ") || user.Senha,
                dataCadastro: user.dataAlteracao,
                dataAlteracao: new Date (),
                Status: validarStatus(await questionAsync("Insira o Status(Ativo/Inativo):"), user.Status)
            }
            
            // Pergunta se o Administrador logado deseja salvar as alterações
            const salvar = (await questionAsync("Desaja salvar as alterações?(S/N) ")).toLowerCase()
        
            //caso sim ele salva
        if(["s", "y", "yes", "sim"].includes(salvar)){
           const nUser = usuarioSchema.parse(usuerAlterado)
           user.Nome = nUser.Nome
           user.Email = nUser.Email
           user.Papel = nUser.Papel
           user.Senha = await bcrypt.hash(nUser.Senha, 10)
           user.dataCadastro = nUser.dataCadastro
           user.dataAlteracao = nUser.dataAlteracao
           user.Status = nUser.Status
           console.log("Alterações salvas")
           break
            }

            //caso não
        else if (["n", "not", "no", "não", "nao"].includes(salvar)){
            console.log("Alterações descartadas")
            break

            //digitar algum comando não reconhecido ele não salva as alterações
        }else{
            console.log("Comando não reconhecido, descartando alterações")
            break
        }
     }
    }
    }
    // transforma o json em um csv
    const cvs2 = await json2csv.parseAsync(user_cadastro,{header:true})
    // Salva as alterações em um csv
    fs.writeFileSync(filePath, cvs2, "utf8")
    }catch(err){
        // caso alguma informação altera não atenda as exigências estabelicidas no objeto zod
        // ele retorna um erro
        console.log("Alguma informação não atendeu os paramêtros desejados, o que ocasionou o erro: ",err)
    }
}

// Verifica se o usuário existe no CSV e sua permissão
export function retornarUsuarios(filePath: string, Email: string, Senha: string) {
    // Lê o arquivo csv
    const csv = fs.readFileSync(filePath, "utf-8")
    // Converter de csv para json com o papaparse
    const csvObject = Papa.parse(csv,{header:true,
        dynamicTyping:true
    }).data
    type UserZod = z.infer<typeof usuarioSchema>
    const user_cadastro: UserZod[] = z.array(usuarioSchema).parse(csvObject)
    //percorre a lista para ver qual o papel de quem está logando
    for (const user of user_cadastro){
        //verifica o email e a senha
        if(user.Email === Email &&  (bcrypt.compareSync(Senha, user.Senha)) === true) {
            switch((user.Papel).toString()){
                // caso o Papel do Usuário seja Administrador
                case "Administrador": {
                    console.log("Logado Como Administrador!")
                    return "1"
                }
                // caso o Papel do Usuário seja Convidado
                case "Convidado": {
                    console.log("Logado Como Convidado!")
                    return "2"
                }
                // caso o Papel do Usuário seja Professor
                //OBS: Ele possui o mesmo nivel de acesso de Convidado
                case "Professor": {
                    console.log("Logado como Professsor!")
                    return "2"
                }
            }
        }
        
    }
    // Emite um aviso de que os dados podem estar incorretos
    // Ou cimplesmente não consta no arquivo CSV
    console.log("Dados incorretos ou Usuário não possui uma conta.")
}

// Verificando a Existência de um arquivo csv, caso não encontre ele cria um usuário padrão
export async function csvExiste(fileName:string){
    try{
        // Caso o arquivo não exista
    if(!fs.existsSync(fileName)){
        // Emite um aviso de que não foi encontrado
        // Toma as devidas providências
        console.log("Arquivo csv não encontrado, criando um usuário padrão")
        // Cria um usuário padrão que NÃO PODE SER ALTERADO OU DELETADO
        // Ele apesar de ser igual aos outros, dentro do código
        // Ele é tratado como execessão a regra
        // Afim de manter a integridade
        const marcos = {
            UUID:uuidv4(),
            Nome: "Marcos",
            Email: "marcos@gmail.com",
            Senha: "Marcos123$%",
            Papel:Papel.Administrador,
            dataCadastro: new Date(),
            dataAlteracao: new Date(),
            Status: "Ativo"
        }
        // Criptografa a senha
        marcos.Senha = bcrypt.hashSync(marcos.Senha, 10)
        type Schema = z.infer<typeof usuarioSchema>
        const Marcos: Schema = usuarioSchema.parse(marcos)
        const csv =  await json2csv.parseAsync(Marcos, {header: true})
        // Salva as alterações em um csv
        fs.writeFileSync(fileName, csv, "utf8")
    }
    else{
        // Caso o arquivo CSV exista ele verifica se o Usuário "Padrão"
        // Existe no arquivo
        const marcos = {
            UUID:uuidv4(),
            Nome: "Marcos",
            Email: "marcos@gmail.com",
            Senha: "Marcos123$%",
            Papel:Papel.Administrador,
            dataCadastro: new Date(),
            dataAlteracao: new Date(),
            Status: "Ativo"
        }
        // cria um tipo
        type Schema = z.infer<typeof usuarioSchema>
        // compara este tipo, caso falhe ele retonra um erro "catch"
        const Marcos: Schema = usuarioSchema.parse(marcos)
        // Lê um arquivo csv
        const csv = fs.readFileSync(fileName, "utf8")
        // Converte de um arquivo csv para json com o papaparse
        const csvObject = Papa.parse(csv,{
            header:true,
            dynamicTyping: true
        }).data
        // Obtém os valores dos atributos em uma lista
        const obj2 = Object.values(Marcos)
        const csvArray: Schema[] = z.array(usuarioSchema).parse(csvObject)
        // Percorre todo os usuários do CSV
        for(const usuario of csvArray){
            // Verifica se o email existe e faz mais verificações caso exista
            // Afim de manter a integridade
            if(usuario.Email === "marcos@gmail.com"){
                // Obtém os valores das chaves
            const obj1 = Object.values(usuario)
            // Percorre cada atributo do usuário padrão
            for(const item of obj2){   
                //Verifica se não é o primeiro item, no caso o UUID 
                if(obj2.indexOf(item) != 0){
                    // obtem o index atual
                    const indice_obj2 = obj2.indexOf(item)
                    // Isola os demais atributos e compara  Papel do usuário, juntamente com o Status
                    if(indice_obj2 != 3 && indice_obj2 != 5 && indice_obj2 != 6 ){
                        if(obj1[obj2.indexOf(item)] !== item){
                            // Envia a mensagem de aviso dos atributos comparados
                            // Que não conhecidem de maneira desejada
                            console.log("Estes dados não batem", obj1[obj2.indexOf(item)],"e", item)
                            return
                        }
                    // Caso o atributo comparado seja a senha
                    }else if (indice_obj2 == 3){
                        // Usa o bcrypt para ver se a senha do csv condiz com os paramêtros internos
                        // retornando true ou false
                        if(!(await bcrypt.compare(item as string, obj1[obj2.indexOf(item)] as string ))){
                            // caso false ele envia a mensagem de aviso
                            // sobre a senha que foi alterada
                            console.log("\n Foi Vasculhado o arquivo csv, e foi identificado que a senha do Usuário Marcos foi alterada!")
                            return

                        }

                  
                    }else{
                        return
                    }
                }else{
                    // verifica também a integridade da UUID
                    if(!isUUID(item)){
                        // Caso identificado anomalia
                        // retorna um aviso sobre a UUID
                        console.log("A UUID não é valida")
                        return
                    }
                }
            }
                
            }else{
                // Caso o ele não encontre o nenhum email correspondente
                // Ele retorna um aviso de que não foi possivel encontrar
                // Recomenda-se Deletar o arquivo csv e deixar
                // Que o código crie um novo do zero
                if(csvArray.length === csvArray.indexOf(usuario)+1){
                    console.log("Usuário Administrador Marcos não encontrado")
                    console.log("Por favor, delete o arquivo csv, e reinicie o programa")
                    console.log("Permitindo que o programa crie um do novo arquivo csv")
                    console.log("Para que as exigências internas sejam atendidas")
                    return
                }else{
                continue

                }
            }
        
            }

        }
    }catch(err){
        // Ele retorna um erro caso ele falhe no processo
        // De validação do schemaUsuario
        // Indicando problema de integridade
        // Com atributos a mais ou a menos no csv
        // Ou nomeados de maneira diferente
        console.log("Um erro de integridade foi detectado:",err)
    }
}


