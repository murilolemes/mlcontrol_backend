import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Controller('/clients')
export class ListClientController {
  constructor(private prisma: PrismaService) { }

  @Get(':id')
  async list(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    const pageNumber = Number(page)
    const pageSize = Number(limit)
    const where: Prisma.ClientWhereInput = {
      companyId: id,
      ...(search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { fantasyName: { contains: search, mode: 'insensitive' } },
            { cpfCnpj: { contains: search, mode: 'insensitive' } },
            {
              emails: {
                some: {
                  address: { contains: search, mode: 'insensitive' },
                },
              },
            },
          ],
        }
        : {}),
    }

    const clients = await this.prisma.client.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [orderBy]: order,
      },
      select: {
        id: true,
        name: true,
        fantasyName: true,
        type: true,
        cpfCnpj: true,
        stateRegistration: true,
        observation: true,
        provider: true,
        active: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        emails: {
          select: {
            id: true,
            address: true,
            verified: true,
            active: true,
            createdAt: true,
          },
        },
        phones: {
          select: {
            id: true,
            number: true,
            active: true,
            createdAt: true,
          },
        },
      },
    })

    const total = await this.prisma.client.count({
      where,
    })

    return {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      clients
    }
  }
}
