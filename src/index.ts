
// Importa as bibliotecas necessárias
import { cadastrarUsuário } from "./services/usuárioService";
import { listarTodosUsuários, listarUsuario, deletarUsuario, alterUsuario, retornarUsuarios, csvExiste } from "./services/csvService";
import { questionAsync, rl } from "./services/usuárioService";
// Caminho padrão para escrever o csv
const fileName = "usuarios.csv"

//  AVISO: SE POR ALGUM MOTIVO O ARQUIVO CSV FOR ALTERADO MANUALMENTE DURANTE A EXECUÇÃO DESDE CÓDIGO OU ATÉ MESMO DELETADO, O CÓDIGO VAI QUEBRAR
//  VISTO QUE A FUNÇÃO QUE GARANTE A INTEGRIDADE É CHAMADA APENAS UMA VEZ DURANTE O CÓDIGO. NA ESTRUTURA LÓGICA DO CÓDIGO NÃO É POSSÍVEL FAZER COM QUE
//  CSV SEJA ALTERADO DE MANEIRA INDEVIDA

// Função principal que chamas as demais
async function main(){
    // Verifica se o arquivo csv já existe
    csvExiste(fileName)
    // Pergunta o usuário se ele quer logar no sistema
    while(true){
        const logar = (await questionAsync("Deseja logar no sistema?(S/N): ")).toLowerCase()
        if(logar == "s"){
            while(true){
                // Ele pede os dados para logar(Email/Senha) e Compara pra ver se existe um usuário correspondete
                console.log("Olá, Por favor forneça os dados para logar no sistema")
                const Email = await questionAsync("Email: ") 
                // Caso Email fornecido seja vazio ele ignora manda um aviso e ignora o resto do while, fazendo novamente a mesma pergunta
                if(!Email){
                    console.log("O campo não pode permanecer vazio")
                    continue
                }
                const Senha = await questionAsync("Senha: ")
                // Mesmo coisa que acontece no email, só que para a senha  
                if(!Senha){
                    console.log("A senha não pode ficar vazia, insira os dados novamente")
                    continue
                }
                // Chama a função que irá verificar se o usuário existe e qual categoria pertence (Adminstrador/Professor/Convidado)
                switch(retornarUsuarios(fileName, Email, Senha)){
                    // Adminstrador a função retorna "1"
                    case "1":{
                            while(true){
                                console.log("O que deseja fazer?:")
                                console.log("1: Escrever usuário")
                                console.log("2: Listar Usuarios")
                                console.log("3: Listar usuarios por id")
                                console.log("4: Alterar usuarios por id")
                                console.log("5: Deletar usuários por id")
                                console.log("6: Deslogar do sistema")
                                const opcao = await questionAsync(":")
                                switch(opcao){
                                    case "1":{
                                        await cadastrarUsuário()
                                        continue
                                    }
                                    // Chama a função que retonar todos os registros do CSV
                                    case "2":{
                                        listarTodosUsuários(fileName)
                                        continue
                                    }
                                    // Chama a função que retorna apenas um registro, se houver, utiliazando a UUID para selecionar
                                    case "3":{
                                        await listarUsuario(fileName)
                                        continue
                                    }
                                    // Chama a função que permite alterar dados dos usuário exceto do Marcos
                                    case "4":{
                                        await alterUsuario(fileName)
                                        continue
                                    }
                                    // Chama a função que permite deletar usuário desde que ele não seja o Marcos
                                    case "5":{
                                        await deletarUsuario(fileName, Email, Senha)
                                        continue
                                    }
                                    // Sai deste loop
                                    case "6":{
                                        break
                                    }
                                    // Caso o valor fonecido não corresponda a nenhuma das opções, envia uma mensagem de aviso e volta novamente para o começo
                                    default:{
                                        console.log("Opção inválida, por favor insira uma opção válida!!!")
                                        continue
                                    }
                                }break
                            }break
                        }
                    // Convidado e Professor retornam as mesmas opções
                    case "2":{
                        while(true){
                            // Mostra as opões disponiveis para o Usuário com este Papel: Administrador
                            console.log("O que deseja fazer?:")
                            console.log("1: Listar Usuarios")
                            console.log("2: Listar usuarios por id")
                            console.log("3: Deslogar do sistema")
                            const opcao = await questionAsync(":")
                            switch(opcao){
                                // Chama a função que retonar todos os registros do CSV
                                case "1":{
                                    listarTodosUsuários(fileName)
                                    continue
                                }
                                // Chama a função que retorna apenas um registro, se houver, utiliazando a UUID para selecionar
                                case "2":{
                                    await listarUsuario(fileName)
                                    continue
                                }
                                // Encerra este while
                                case "3":{
                                    break
                                }
                                // Caso o valor fonecido não corresponda a nenhuma das opções, envia uma mensagem de aviso e volta novamente para o começo
                                default:{
                                    console.log("Opção inválida, por favor insira uma opção válida!!!")
                                    continue
                                }
                            }break
                        }break
                    }}break
                }
        // Sai da função caso a opção escolhida seja "n"        
        }else if (logar == "n"){
                rl.close()
                break
        // Invia um aviso de comando não reconhecido e faz novamente a pergunta
        }else{
            console.log("Comando não reconhecido, por favor tente novamente")
        }
    }
}
// Chama a função Principal
main()