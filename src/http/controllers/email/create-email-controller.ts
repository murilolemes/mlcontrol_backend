import { ZodValidationPipe } from "@/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import z from "zod";

const createEmailBodySchema = z.object({
  address: z.string().email('E-mail inválido').nonempty('O e-mail é obrigatório'),
  clientId: z.string().nonempty('cliente não informado'),
  companyId: z.string().nonempty('Empresa não informada')
})

type CreateEmailBodySchema = z.infer<typeof createEmailBodySchema>

@Controller('/emails')
export class CreateEmailController {
  constructor(private prisma: PrismaService) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createEmailBodySchema))
  async handle(@Body() body: CreateEmailBodySchema) {
    const {
      address,
      clientId,
      companyId
    } = body

    const emailWithSameAddress = await this.prisma.email.findUnique({
      where: {
        address
      }
    })

    if (emailWithSameAddress) {
      throw new ConflictException(
        'Já existe um e-mail cadastrado com esse endereço'
      )
    }

    const clientExists = await this.prisma.client.findUnique({
      where: {
        id: clientId
      }
    })

    if (!clientExists) {
      throw new ConflictException(
        'Cliente não encontrado'
      )
    }

    const companyExists = await this.prisma.company.findUnique({
      where: {
        id: companyId
      }
    })

    if (!companyExists) {
      throw new ConflictException(
        'Empresa não encontrada'
      )
    }

    const email = await this.prisma.email.create({
      data: {
        address,
        clientId,
        companyId
      }
    })

    return {
      email
    }
  }
}