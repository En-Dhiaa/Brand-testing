-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "design" TEXT NOT NULL,
    "previewUrl" TEXT,
    "pngUrl" TEXT,
    "jpgUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "userName" TEXT NOT NULL DEFAULT 'مشارك',
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'مدير النظام',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_publicId_key" ON "Proposal"("publicId");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "Proposal_createdAt_idx" ON "Proposal"("createdAt");

-- CreateIndex
CREATE INDEX "Proposal_votesCount_idx" ON "Proposal"("votesCount");

-- CreateIndex
CREATE INDEX "Proposal_likesCount_idx" ON "Proposal"("likesCount");

-- CreateIndex
CREATE INDEX "Like_proposalId_idx" ON "Like"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_proposalId_visitorId_key" ON "Like"("proposalId", "visitorId");

-- CreateIndex
CREATE INDEX "Vote_proposalId_idx" ON "Vote"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_proposalId_voterId_key" ON "Vote"("proposalId", "voterId");

-- CreateIndex
CREATE INDEX "Comment_proposalId_idx" ON "Comment"("proposalId");

-- CreateIndex
CREATE INDEX "Comment_status_idx" ON "Comment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

