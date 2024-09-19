-- CreateTable
CREATE TABLE "ActiveTicket" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "activeUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Good" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Good_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleStand" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleStand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleStandGood" (
    "id" TEXT NOT NULL,
    "saleStandId" TEXT NOT NULL,
    "goodId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleStandGood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "physicalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketCredit" (
    "id" TEXT NOT NULL,
    "activeTicketId" TEXT NOT NULL,
    "centsAmount" INTEGER NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketDebit" (
    "id" TEXT NOT NULL,
    "activeTicketId" TEXT NOT NULL,
    "saleStandGoodId" TEXT NOT NULL,
    "centsAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketDebit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SaleStand_code_key" ON "SaleStand"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_physicalCode_key" ON "Ticket"("physicalCode");

-- AddForeignKey
ALTER TABLE "ActiveTicket" ADD CONSTRAINT "ActiveTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleStandGood" ADD CONSTRAINT "SaleStandGood_saleStandId_fkey" FOREIGN KEY ("saleStandId") REFERENCES "SaleStand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleStandGood" ADD CONSTRAINT "SaleStandGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCredit" ADD CONSTRAINT "TicketCredit_activeTicketId_fkey" FOREIGN KEY ("activeTicketId") REFERENCES "ActiveTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketDebit" ADD CONSTRAINT "TicketDebit_activeTicketId_fkey" FOREIGN KEY ("activeTicketId") REFERENCES "ActiveTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketDebit" ADD CONSTRAINT "TicketDebit_saleStandGoodId_fkey" FOREIGN KEY ("saleStandGoodId") REFERENCES "SaleStandGood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
