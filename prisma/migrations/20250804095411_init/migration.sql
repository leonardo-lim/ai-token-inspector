-- CreateTable
CREATE TABLE "public"."TokenResult" (
    "id" SERIAL NOT NULL,
    "tokenQueryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "marketCap" DOUBLE PRECISION NOT NULL,
    "fdv" DOUBLE PRECISION NOT NULL,
    "volume24h" DOUBLE PRECISION NOT NULL,
    "liquidity" DOUBLE PRECISION NOT NULL,
    "aiInsight" TEXT NOT NULL,
    "safetyScore" INTEGER NOT NULL,

    CONSTRAINT "TokenResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenQuery" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenResult_tokenQueryId_key" ON "public"."TokenResult"("tokenQueryId");

-- AddForeignKey
ALTER TABLE "public"."TokenResult" ADD CONSTRAINT "TokenResult_tokenQueryId_fkey" FOREIGN KEY ("tokenQueryId") REFERENCES "public"."TokenQuery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
