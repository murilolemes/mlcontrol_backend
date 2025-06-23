import { ConflictException } from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, login, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    const userWithSameLogin = await this.prisma.user.findUnique({
      where: {
        login
      }
    })

    if (userWithSameEmail) {
      throw new ConflictException('Já existe um usuário com este e-mail cadastrado')
    }

    if (userWithSameLogin) {
      throw new ConflictException('Já existe um usuário com este login cadastrado')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        login,
        password: hashedPassword,
      }
    })
  }
}