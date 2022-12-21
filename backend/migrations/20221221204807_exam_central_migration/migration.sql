-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "avatar_filesize" INTEGER,
    "avatar_extension" TEXT,
    "avatar_width" INTEGER,
    "avatar_height" INTEGER,
    "avatar_id" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'regular',
    "status" TEXT NOT NULL DEFAULT 'active',
    "reasonFlagged" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "banner_filesize" INTEGER,
    "banner_extension" TEXT,
    "banner_width" INTEGER,
    "banner_height" INTEGER,
    "banner_id" TEXT,
    "logo_filesize" INTEGER,
    "logo_extension" TEXT,
    "logo_width" INTEGER,
    "logo_height" INTEGER,
    "logo_id" TEXT,
    "status" TEXT,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "status" TEXT,
    "courseCode" TEXT NOT NULL DEFAULT '',
    "duration" DOUBLE PRECISION NOT NULL,
    "noOfSemester" INTEGER,
    "semesterSystem" TEXT DEFAULT '2',
    "university" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "paperCode" TEXT NOT NULL DEFAULT '',
    "year" INTEGER NOT NULL,
    "semester" INTEGER,
    "uploadedBy" TEXT,
    "type" TEXT DEFAULT 'university',
    "flag" TEXT DEFAULT 'none',
    "status" TEXT DEFAULT 'draft',
    "isActive" TEXT DEFAULT 'active',
    "original_filesize" INTEGER,
    "original_filename" TEXT,
    "source_filesize" INTEGER,
    "source_filename" TEXT,
    "university" TEXT,
    "course" TEXT,
    "competitivePaper" TEXT,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitivePaper" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CompetitivePaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_User_bookmarks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Course_university_idx" ON "Course"("university");

-- CreateIndex
CREATE INDEX "Paper_uploadedBy_idx" ON "Paper"("uploadedBy");

-- CreateIndex
CREATE INDEX "Paper_university_idx" ON "Paper"("university");

-- CreateIndex
CREATE INDEX "Paper_course_idx" ON "Paper"("course");

-- CreateIndex
CREATE INDEX "Paper_competitivePaper_idx" ON "Paper"("competitivePaper");

-- CreateIndex
CREATE UNIQUE INDEX "_User_bookmarks_AB_unique" ON "_User_bookmarks"("A", "B");

-- CreateIndex
CREATE INDEX "_User_bookmarks_B_index" ON "_User_bookmarks"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_university_fkey" FOREIGN KEY ("university") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_university_fkey" FOREIGN KEY ("university") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_course_fkey" FOREIGN KEY ("course") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_competitivePaper_fkey" FOREIGN KEY ("competitivePaper") REFERENCES "CompetitivePaper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_User_bookmarks" ADD CONSTRAINT "_User_bookmarks_A_fkey" FOREIGN KEY ("A") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_User_bookmarks" ADD CONSTRAINT "_User_bookmarks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
