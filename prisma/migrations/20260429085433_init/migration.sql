/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `emails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "emails_address_key" ON "emails"("address");
