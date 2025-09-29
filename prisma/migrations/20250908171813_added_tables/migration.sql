-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDescription" TEXT,
    "eventLocation" TEXT,
    "eventDateAndTime" TIMESTAMP(3) NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "bookedSeats" INTEGER NOT NULL,
    "ticketPrices" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QRCode" (
    "id" SERIAL NOT NULL,
    "size" INTEGER,
    "url" TEXT,
    "tokenId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "qrCodeId" INTEGER,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_qrCodeId_key" ON "public"."Ticket"("qrCodeId");

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ticket" ADD CONSTRAINT "Ticket_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "public"."QRCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
