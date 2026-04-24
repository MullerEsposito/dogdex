-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DogEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "localId" TEXT,
    "breedName" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "locationAddr" TEXT NOT NULL,
    "imageUri" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'synced',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DogEntry" ("breedName", "confidence", "createdAt", "id", "imageUri", "localId", "locationAddr", "timestamp", "userId") SELECT "breedName", "confidence", "createdAt", "id", "imageUri", "localId", "locationAddr", "timestamp", "userId" FROM "DogEntry";
DROP TABLE "DogEntry";
ALTER TABLE "new_DogEntry" RENAME TO "DogEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
