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
import { hash } from 'bcryptjs'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(200, 'O nome deve ter no máximo 200 caracteres')
    .nonempty('O nome é obrigatório'),
  email: z.string().email('E-mail inválido').nonempty('O e-mail é obrigatório'),
  login: z
    .string()
    .min(3, 'O login deve ter pelo menos 3 caracteres')
    .max(50, 'O login deve ter no máximo 50 caracteres')
    .nonempty('O login é obrigatório'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres')
    .nonempty('A senha é obrigatória'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, login, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    const userWithSameLogin = await this.prisma.user.findUnique({
      where: {
        login,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'Já existe um usuário com este e-mail cadastrado',
      )
    }

    if (userWithSameLogin) {
      throw new ConflictException(
        'Já existe um usuário com este login cadastrado',
      )
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        login,
        password: hashedPassword,
        // createdAt: getNewDate(),
        // updatedAt: getNewDate(),
      },
    })
  }
}
