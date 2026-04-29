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

const createCompanyBodySchema = z.object({
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
    message: 'O tipo da empresa deve ser PF ou PJ',
  }),
  cpfCnpj: z
    .string()
    .min(11, 'CPF/CNPJ inválido')
    .max(18, 'CPF/CNPJ inválido')
    .nonempty('O CPF/CNPJ é obrigatório'),
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
})

type CreateCompanyBodySchema = z.infer<typeof createCompanyBodySchema>

@Controller('/companies')
export class CreateCompanyController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCompanyBodySchema))
  async handle(@Body() body: CreateCompanyBodySchema) {
    const { name, fantasyName, type, cpfCnpj, stateRegistration, observation } =
      body

    const companyWithSameCpfCnpj = await this.prisma.company.findUnique({
      where: {
        cpfCnpj,
      },
    })

    if (companyWithSameCpfCnpj) {
      throw new ConflictException('Ja existe uma empresa com este CPF/CNPJ')
    }

    const company = await this.prisma.company.create({
      data: {
        name,
        fantasyName,
        type,
        cpfCnpj,
        stateRegistration,
        observation,
      },
    })

    return {
      company,
    }
  }
}
