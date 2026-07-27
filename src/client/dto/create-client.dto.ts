import { ClientType } from "@prisma/client";
import { z } from "zod";

export const createClientBodySchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(200, 'O nome deve ter no máximo 200 caracteres')
    .nonempty('O nome é obrigatório'),
  fantasyName: z
    .string()
    .min(3, 'O nome fantasia deve ter pelo menos 3 caracteres')
    .max(200, 'O nome fantasia deve ter no máximo 200 caracteres')
    .optional(),
  type: z.nativeEnum(ClientType, {
    message: 'O tipo do cliente deve ser PF ou PJ',
  }),
  cpfCnpj: z
    .string()
    .min(11, 'CPF/CNPJ inválido')
    .max(18, 'CPF/CNPJ inválido')
    .optional(),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().max(20, 'O telefone deve ter no máximo 20 caracteres').optional(),
  stateRegistration: z
    .string()
    .max(50, 'A inscrição estadual deve ter no máximo 50 caracteres')
    .optional(),
  observation: z
    .string()
    .max(500, 'A observação deve ter no máximo 500 caracteres')
    .optional(),
  companyId: z.string().nonempty('Empresa não informada'),
})

export type CreateClientDto = z.infer<typeof createClientBodySchema>