-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "branchId" TEXT,
    "avatar" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "faculties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "branchId" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "faculties_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "subjects_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "online_classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "max_student" INTEGER NOT NULL DEFAULT 50,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "online_classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "online_classes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "online_classes_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "class_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "online_class_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "class_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "class_members_online_class_id_fkey" FOREIGN KEY ("online_class_id") REFERENCES "online_classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "online_class_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "lessons_online_class_id_fkey" FOREIGN KEY ("online_class_id") REFERENCES "online_classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lessons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "file_resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uploader_id" TEXT NOT NULL,
    "online_class_id" TEXT,
    "lesson_id" TEXT,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "file_resources_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_resources_online_class_id_fkey" FOREIGN KEY ("online_class_id") REFERENCES "online_classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "file_resources_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author_id" TEXT NOT NULL,
    "online_class_id" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "posts_online_class_id_fkey" FOREIGN KEY ("online_class_id") REFERENCES "online_classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'LIKE',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teacher_calendars" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacher_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "online_class_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "teacher_calendars_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "teacher_calendars_online_class_id_fkey" FOREIGN KEY ("online_class_id") REFERENCES "online_classes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teacher_faculties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacher_id" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "teacher_faculties_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "teacher_faculties_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "faculties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "teacher_subjects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacher_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "teacher_subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "teacher_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");

-- CreateIndex
CREATE UNIQUE INDEX "online_classes_code_key" ON "online_classes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "class_members_user_id_online_class_id_key" ON "class_members"("user_id", "online_class_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_post_id_user_id_key" ON "reactions"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_faculties_teacher_id_faculty_id_key" ON "teacher_faculties"("teacher_id", "faculty_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_subjects_teacher_id_subject_id_key" ON "teacher_subjects"("teacher_id", "subject_id");
