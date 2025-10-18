-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivitySchedules" (
    "activity_schedule_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "activity_id" INTEGER NOT NULL,
    "has_time" BOOLEAN NOT NULL DEFAULT true,
    "start_time" DATETIME,
    "end_time" DATETIME,
    "day_of_week" TEXT NOT NULL,
    CONSTRAINT "ActivitySchedules_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities" ("activity_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActivitySchedules" ("activity_id", "activity_schedule_id", "day_of_week", "end_time", "has_time", "start_time") SELECT "activity_id", "activity_schedule_id", "day_of_week", "end_time", "has_time", "start_time" FROM "ActivitySchedules";
DROP TABLE "ActivitySchedules";
ALTER TABLE "new_ActivitySchedules" RENAME TO "ActivitySchedules";
CREATE TABLE "new_Routines" (
    "routine_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "guardian_id" INTEGER,
    "creation_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    CONSTRAINT "Routines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Routines_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "Users" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Routines" ("creation_date", "description", "guardian_id", "routine_id", "user_id") SELECT "creation_date", "description", "guardian_id", "routine_id", "user_id" FROM "Routines";
DROP TABLE "Routines";
ALTER TABLE "new_Routines" RENAME TO "Routines";
CREATE TABLE "new_Activities" (
    "activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routine_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "activity_type" TEXT NOT NULL,
    CONSTRAINT "Activities_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "Routines" ("routine_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Activities" ("activity_id", "activity_type", "description", "routine_id", "title") SELECT "activity_id", "activity_type", "description", "routine_id", "title" FROM "Activities";
DROP TABLE "Activities";
ALTER TABLE "new_Activities" RENAME TO "Activities";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
