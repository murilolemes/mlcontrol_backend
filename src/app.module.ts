import { AccountModule } from "@/account/module/account.module"
import { AuthenticationModule } from "@/authentication/module/authentication.module"
import { ClientModule } from "@/client/client.module"
import { CompanyModule } from "@/company/company.module"
import { IntegracoesModule } from '@/integrations/integration.module'
import { GuardsModule } from '@/shared/guards/guards.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule, // Conexão banco de dados
    GuardsModule, // JWTGuard, JWTStrategy
    AuthenticationModule, // Autenticação
    AccountModule, // Usuários
    ClientModule, // Clientes
    CompanyModule, // Empresas
    IntegracoesModule // Integrações - Receitaws
  ],
})
export class AppModule { }
