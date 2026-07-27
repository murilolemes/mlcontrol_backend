import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';

import { CompanyService } from '@/company/service/company.service';
import { CreateClientDto } from '../dto/create-client.dto';

@Injectable()
export class CreateClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: CompanyService,
  ) { }

  async execute(data: CreateClientDto) {
    const {
      name,
      fantasyName,
      type,
      cpfCnpj,
      stateRegistration,
      observation,
      companyId,
      email,
      phone,
    } = data;

    // Verifica se a empresa existe
    await this.companyService.ensureExists(companyId)

    // Verifica se já existe um cliente com o mesmo CPF/CNPJ
    if (cpfCnpj) {
      const clientWithSameCpfCnpj = await this.prisma.client.findFirst({
        where: {
          cpfCnpj,
          companyId,
        },
      });

      if (clientWithSameCpfCnpj) {
        throw new ConflictException(
          'Já existe um cliente com este CPF/CNPJ',
        );
      }
    }

    // Verifica se já existe um cliente com o mesmo e-mail
    if (email) {
      const clientWithSameEmail = await this.prisma.email.findFirst({
        where: {
          address: email,
          companyId,
        },
      });

      if (clientWithSameEmail) {
        throw new ConflictException(
          'Já existe um cliente com este e-mail',
        );
      }
    }

    // Cria cliente e e-mail em uma transação
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
      });

      if (email) {
        await tx.email.create({
          data: {
            address: email,
            clientId: createdClient.id,
            companyId,
          },
        });
      }

      if (phone) {
        await tx.phone.create({
          data: {
            number: phone,
            clientId: createdClient.id,
            companyId,
          },
        });
      }

      return createdClient;
    });

    return {
      client,
    };
  }
}