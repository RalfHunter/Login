import { z } from 'zod';
import { Papel } from './papeis';
import { Status } from './papeis'

// Utiliza o zod para criar um modelo para o usuário
export const usuarioSchema = z.object({
    UUID: z.string().uuid(),
    Nome: z.string().min(3).max(25),
    Email: z.string().email(),
    Senha: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[!@#$%¨&*()<>:?;]/),
    Papel: z.nativeEnum(Papel),
    dataCadastro: z.date(),
    dataAlteracao: z.date(),
    Status: z.nativeEnum(Status)
})
