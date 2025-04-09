-- DropIndex
DROP INDEX "github_repositories_fullName_key";

-- CreateIndex
CREATE INDEX "github_repositories_projectId_fullName_idx" ON "github_repositories"("projectId", "fullName");

-- CreateIndex
CREATE INDEX "github_repositories_fullName_idx" ON "github_repositories"("fullName");
