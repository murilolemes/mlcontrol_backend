import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

import { PrismaService } from "@/prisma/prisma.service";
import { JwtAuthGuard } from "@/shared/guards/jwt-auth.guard";
import { ZodValidationPipe } from "@/shared/pipes/zod-validation-pipe";

const updateAccountBodySchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(200, 'O nome deve ter no máximo 200 caracteres')
    .optional(),
  email: z.string().email('E-mail inválido').optional(),
  login: z
    .string()
    .min(3, 'O login deve ter pelo menos 3 caracteres')
    .max(50, 'O login deve ter no máximo 50 caracteres')
    .optional(),
  oldPassword: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres')
    .optional(),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres')
    .optional(),
})

type UpdateAccountBodySchema = z.infer<typeof updateAccountBodySchema>

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class UpdateAccountController {
  constructor(private prisma: PrismaService) { }

  @Put(':id')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(updateAccountBodySchema))
  async handle(
    @Param('id') id: string,
    @Body() body: UpdateAccountBodySchema
  ) {
    const { name, email, login, oldPassword, password } = body

    const userExists = await this.prisma.user.findUnique({
      where: { id }
    })

    if (!userExists) {
      throw new ConflictException(
        'Usuário não encontrado',
      )
    }

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    const userWithSameLogin = await this.prisma.user.findUnique({
      where: {
        login,
      }
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



    const compareOldPassword = oldPassword && await compare(oldPassword, userExists.password)

    if (!compareOldPassword) {
      throw new ConflictException(
        'Senha antiga incorreta',
      )
    }

    const hashedPassword = password ? await hash(password, 8) : undefined

    await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        login,
        password: hashedPassword
      }
    })
  }
}