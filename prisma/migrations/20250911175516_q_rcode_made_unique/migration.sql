/*
  Warnings:

  - Made the column `qrCodeId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Ticket" ALTER COLUMN "qrCodeId" SET NOT NULL;
