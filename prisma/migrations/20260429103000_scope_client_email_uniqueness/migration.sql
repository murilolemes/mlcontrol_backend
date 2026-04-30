-- Drop global unique constraints
DROP INDEX "clients_cpf_cnpj_key";
DROP INDEX "emails_address_key";

-- Add per-company unique constraints
CREATE UNIQUE INDEX "clients_company_id_cpf_cnpj_key" ON "clients"("company_id", "cpf_cnpj");
CREATE UNIQUE INDEX "emails_company_id_address_key" ON "emails"("company_id", "address");
