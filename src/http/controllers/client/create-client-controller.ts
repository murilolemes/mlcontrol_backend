import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ClientType } from '@prisma/client'
import { z } from 'zod'

const createClientBodySchema = z.object({
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

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>

@Controller('/client')
export class CreateClientController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientBodySchema))
  async handle(@Body() body: CreateClientBodySchema) {
    const {
      name,
      fantasyName,
      type,
      cpfCnpj,
      stateRegistration,
      observation,
      companyId,
      email,
      phone
    } = body

    // VERIFICA SE A EMPRESA EXISTE
    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId,
      }
    })

    if (!companyExists) {
      throw new ConflictException(
        'Empresa não encontrada'
      )
    }

    // VERIFICA SE JÁ EXISTE UM CLIENTE COM O MESMO CPF/CNPJ NA MESMA EMPRESA
    const clientWithSameCpfCnpj = await this.prisma.client.findFirst({
      where: {
        cpfCnpj,
        companyId,
      },
    })

    if (clientWithSameCpfCnpj && cpfCnpj) {
      throw new ConflictException('Ja existe um cliente com este CPF/CNPJ')
    }

    // VERIFICA SE JÁ EXISTE UM CLIENTE COM O MESMO E-MAIL NA MESMA EMPRESA
    const clientWithSameEmail = email
      ? await this.prisma.email.findFirst({
        where: {
          address: email,
          companyId,
        }
      })
      : null

    if (email && clientWithSameEmail) {
      throw new ConflictException(
        'Já existe um cliente com este e-mail'
      )
    }

    // CRIA O CLIENTE E O E-MAIL DENTRO DE UMA TRANSAÇÃO
    const client = await this.prisma.$transaction(async (tx) => {
      const createdClient = await tx.client.create({
        data: {
          name,
          fantasyName,
          type,
          cpfCnpj,
          stateRegistration,
          observation,
          companyId,
        },
        include: {
          emails: true,
        }
      })

      if (email) {
        await tx.email.create({
          data: {
            address: email,
            clientId: createdClient.id,
            companyId,
          },
        })
      }

      return createdClient
    })

    return {
      client,
    }
  }
}
