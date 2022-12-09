"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core6 = require("@keystone-6/core");
var import_dotenv = __toESM(require("dotenv"));
var import_session = require("@keystone-6/core/session");
var import_auth = require("@keystone-6/auth");

// schemas/User.ts
var import_fields = require("@keystone-6/core/fields");
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var User = (0, import_core.list)({
  ui: {
    listView: {
      initialColumns: ["name", "role"]
    }
  },
  fields: {
    name: (0, import_fields.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields.text)({ isFilterable: true }),
    email: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique", isFilterable: true }),
    avatar: (0, import_fields.image)({ storage: "localImages" }),
    password: (0, import_fields.password)({ validation: { isRequired: true } }),
    role: (0, import_fields.select)({
      validation: { isRequired: true },
      options: [
        { label: "Admin", value: "admin" },
        { label: "Moderator", value: "moderator" },
        { label: "Regular", value: "regular" },
        { label: "Viewer", value: "viewer" }
      ],
      defaultValue: "regular",
      ui: {
        displayMode: "segmented-control"
      }
    }),
    status: (0, import_fields.select)({
      validation: { isRequired: true },
      options: [
        { label: "Active", value: "active" },
        { label: "Flagged", value: "flagged" },
        { label: "Suspended", value: "suspended" }
      ],
      defaultValue: "active",
      ui: {
        displayMode: "segmented-control"
      }
    }),
    reasonFlagged: (0, import_fields.text)(),
    bookmarks: (0, import_fields.relationship)({ ref: "Paper", many: true }),
    papers: (0, import_fields.relationship)({ ref: "Paper.uploadedBy", many: true })
  },
  access: import_access.allowAll
});

// schemas/University.ts
var import_fields3 = require("@keystone-6/core/fields");
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");

// utils/slug.ts
var import_fields2 = require("@keystone-6/core/fields");
var import_nanoid = require("nanoid");
function slug() {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  const nanoid = (0, import_nanoid.customAlphabet)(alphabet, 6);
  return (0, import_fields2.text)({
    hooks: {
      resolveInput: ({ inputData }) => {
        let input = inputData?.name || inputData?.title || "new-item";
        input = input.trim().toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-") ?? "";
        return input + nanoid();
      }
    },
    ui: { createView: { fieldMode: "hidden" } }
  });
}

// schemas/access/university.ts
function isSignedIn({ session: session2 }) {
  return !!session2;
}
var rules = {
  universitiesFilter({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return { status: { equals: "published" } };
    }
    return {
      OR: [
        {
          status: { equals: "published" }
        }
      ]
    };
  },
  canUpdateUniversities({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    return session2?.data.role === "admin" || session2?.data.role === "moderator";
  },
  canDeleteUniversities({ session: session2 }) {
    if (!isSignedIn({ session: session2 })) {
      return false;
    }
    return session2?.data.role === "admin" || session2?.data.role === "moderator";
  }
};

// schemas/University.ts
var University = (0, import_core2.list)({
  access: {
    operation: {
      ...(0, import_access2.allOperations)(isSignedIn),
      query: () => true
    },
    filter: {
      query: rules.universitiesFilter
    },
    item: {
      create: isSignedIn,
      update: rules.canUpdateUniversities,
      delete: rules.canDeleteUniversities
    }
  },
  fields: {
    name: (0, import_fields3.text)({ validation: { isRequired: true }, isFilterable: true }),
    slug: slug(),
    city: (0, import_fields3.text)({ validation: { isRequired: true } }),
    state: (0, import_fields3.text)({ validation: { isRequired: true } }),
    country: (0, import_fields3.text)({ validation: { isRequired: true } }),
    banner: (0, import_fields3.image)({ storage: "localImages" }),
    logo: (0, import_fields3.image)({ storage: "localImages" }),
    status: (0, import_fields3.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      ui: {
        displayMode: "segmented-control"
      }
    }),
    courses: (0, import_fields3.relationship)({ ref: "Course.university", many: true })
  }
});

// schemas/Course.ts
var import_fields4 = require("@keystone-6/core/fields");
var import_core3 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");

// schemas/access/course.ts
function isSignedIn2({ session: session2 }) {
  return !!session2;
}
var rules2 = {
  canReadCourses({ session: session2 }) {
    if (!isSignedIn2({ session: session2 })) {
      return { status: { equals: "published" } };
    }
    return {
      OR: [
        {
          status: { equals: "published" }
        }
      ]
    };
  },
  canUpdateCourses({ session: session2 }) {
    if (!isSignedIn2({ session: session2 })) {
      return false;
    }
    return session2?.data.role === "admin" || session2?.data.role === "moderator";
  },
  canDeleteCourses({ session: session2 }) {
    if (!isSignedIn2({ session: session2 })) {
      return false;
    }
    return session2?.data.role === "admin" || session2?.data.role === "moderator";
  }
};

// schemas/Course.ts
var Course = (0, import_core3.list)({
  access: {
    operation: {
      ...(0, import_access3.allOperations)(isSignedIn2),
      query: () => true
    },
    filter: {
      query: rules2.canReadCourses
    },
    item: {
      create: isSignedIn2,
      update: rules2.canUpdateCourses,
      delete: rules2.canDeleteCourses
    }
  },
  fields: {
    name: (0, import_fields4.text)({ validation: { isRequired: true }, isFilterable: true }),
    slug: slug(),
    status: (0, import_fields4.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      ui: {
        displayMode: "segmented-control"
      }
    }),
    courseCode: (0, import_fields4.text)({ validation: { isRequired: true } }),
    duration: (0, import_fields4.float)({ validation: { isRequired: true } }),
    noOfSemester: (0, import_fields4.integer)(),
    semesterSystem: (0, import_fields4.select)({
      options: [
        { label: "Annual", value: "1" },
        { label: "Semester", value: "2" },
        { label: "Trimester", value: "3" },
        { label: "Quarter Semester", value: "4" }
      ],
      defaultValue: "2"
    }),
    papers: (0, import_fields4.relationship)({ ref: "Paper.course", many: true }),
    university: (0, import_fields4.relationship)({ ref: "University.courses", many: false, isFilterable: true })
  }
});

// schemas/Paper.ts
var import_fields5 = require("@keystone-6/core/fields");
var import_core4 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");

// utils/utils.ts
var import_pdf_lib = require("pdf-lib");
var import_uuid = require("uuid");
var fs = require("fs");
var path = require("path");
async function modifyPdf(fileName, username) {
  const brandText = "EXAM CENTRAL";
  const nameText = `By ${username}`;
  const originalPdf = await readFileFromLocal(fileName);
  const pdfDoc = await import_pdf_lib.PDFDocument.load(originalPdf);
  const helveticaFont = await pdfDoc.embedFont(import_pdf_lib.StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  pages.forEach((page) => {
    const { width, height } = page.getSize();
    let textSize = 50;
    let textWidth = helveticaFont.widthOfTextAtSize(brandText, textSize);
    page.drawText(brandText, {
      x: width - textWidth,
      y: Math.sqrt(3) * (width - textWidth / 2) / 2 - textSize,
      size: textSize,
      font: helveticaFont,
      color: (0, import_pdf_lib.rgb)(0.16, 0.16, 0.16),
      opacity: 0.2,
      rotate: (0, import_pdf_lib.degrees)(55)
    });
    textWidth = helveticaFont.widthOfTextAtSize(nameText, textSize);
    page.drawText(nameText, {
      x: width - textWidth - textSize / 2,
      y: Math.sqrt(3) * (width - textWidth / 2) / 2 - 2 * textSize,
      size: textSize,
      font: helveticaFont,
      color: (0, import_pdf_lib.rgb)(0.16, 0.16, 0.16),
      opacity: 0.2,
      rotate: (0, import_pdf_lib.degrees)(55)
    });
    textSize = 30;
    textWidth = helveticaFont.widthOfTextAtSize(brandText, textSize);
    page.drawText(brandText, {
      x: (width - textWidth) / 3,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - textSize) * 1.5,
      size: textSize,
      font: helveticaFont,
      color: (0, import_pdf_lib.rgb)(0.16, 0.16, 0.16),
      opacity: 0.2,
      rotate: (0, import_pdf_lib.degrees)(55)
    });
    textWidth = helveticaFont.widthOfTextAtSize(nameText, textSize);
    page.drawText(nameText, {
      x: (width - textWidth + textSize) / 3,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - 2 * textSize) * 1.5,
      size: textSize,
      font: helveticaFont,
      color: (0, import_pdf_lib.rgb)(0.16, 0.16, 0.16),
      opacity: 0.2,
      rotate: (0, import_pdf_lib.degrees)(55)
    });
    textSize = 30;
    textWidth = helveticaFont.widthOfTextAtSize(brandText, textSize);
    page.drawText(brandText, {
      x: width - textWidth - textSize / 2,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - textSize) / 4,
      size: textSize,
      font: helveticaFont,
      color: (0, import_pdf_lib.rgb)(0.16, 0.16, 0.16),
      opacity: 0.2,
      rotate: (0, import_pdf_lib.degrees)(55)
    });
    textWidth = helveticaFont.widthOfTextAtSize(nameText, textSize);
    page.drawText(nameText, {
      x: width - textWidth - textSize,
      y: (Math.sqrt(3) * (width - textWidth / 2) / 2 - 2 * textSize) / 4,
      size: textSize,
      font: helveticaFont,
      color: (0, import_pdf_lib.rgb)(0.16, 0.16, 0.16),
      opacity: 0.2,
      rotate: (0, import_pdf_lib.degrees)(55)
    });
  });
  const pdfBytes = await pdfDoc.save();
  return await writeFileToLocal(pdfBytes);
}
async function readFileFromLocal(filename) {
  const filepath = path.join(process.cwd(), "public/files", filename);
  return fs.readFileSync(filepath);
}
async function writeFileToLocal(pdfBytes) {
  const filename = `modify-${(0, import_uuid.v4)()}.pdf`;
  const filepath = path.join(process.cwd(), "public/files", filename);
  fs.writeFileSync(filepath, pdfBytes);
  const filesize = fs.statSync(filepath).size;
  return {
    filename,
    filesize
  };
}

// schemas/access/paper.ts
function isSignedIn3({ session: session2 }) {
  return !!session2;
}
var rules3 = {
  papersQueryFilter({ session: session2 }) {
    if (!isSignedIn3({ session: session2 })) {
      return { status: { equals: "published" } };
    }
    return {
      OR: [
        {
          uploadedBy: { id: { equals: session2?.itemId } }
        },
        {
          status: { equals: "published" }
        }
      ]
    };
  },
  papersUpdateFilter({ session: session2 }) {
    return { uploadedBy: { equals: { id: session2?.itemId } } };
  },
  canUpdatePapers({ session: session2 }) {
    if (!isSignedIn3({ session: session2 })) {
      return false;
    }
    if (session2?.data.role === "admin" || session2?.data.role === "moderator") {
      return true;
    }
    return false;
  },
  canDeletePapers({ session: session2 }) {
    if (!isSignedIn3({ session: session2 })) {
      return false;
    }
    return session2?.data.role === "admin" || session2?.data.role === "moderator";
  }
};

// schemas/Paper.ts
var Paper = (0, import_core4.list)({
  access: {
    operation: {
      ...(0, import_access4.allOperations)(isSignedIn3),
      query: () => true
    },
    filter: {
      query: rules3.papersQueryFilter,
      update: rules3.papersUpdateFilter
    },
    item: {
      create: isSignedIn3,
      update: rules3.canUpdatePapers,
      delete: rules3.canDeletePapers
    }
  },
  fields: {
    name: (0, import_fields5.text)({ validation: { isRequired: true } }),
    slug: slug(),
    paperCode: (0, import_fields5.text)({ validation: { isRequired: true } }),
    year: (0, import_fields5.integer)({ validation: { isRequired: true }, isOrderable: true, isFilterable: true }),
    semester: (0, import_fields5.integer)({ isFilterable: true }),
    uploadedBy: (0, import_fields5.relationship)({ ref: "User.papers", many: false }),
    type: (0, import_fields5.select)({
      options: [
        { label: "University", value: "university" },
        { label: "Competitive", value: "competitive" }
      ],
      defaultValue: "university",
      ui: {
        displayMode: "segmented-control"
      }
    }),
    flag: (0, import_fields5.select)({
      options: [
        { label: "None", value: "none" },
        { label: "Duplicate", value: "duplicate" },
        { label: "Spam/Junk", value: "spam" },
        { label: "Inconsistant", value: "inconsistant" }
      ],
      defaultValue: "none"
    }),
    status: (0, import_fields5.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      defaultValue: "draft",
      ui: {
        displayMode: "segmented-control"
      }
    }),
    isActive: (0, import_fields5.select)({
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ],
      defaultValue: "active",
      ui: {
        displayMode: "segmented-control"
      }
    }),
    original: (0, import_fields5.file)({ storage: "localFiles" }),
    source: (0, import_fields5.file)({ storage: "localFiles" }),
    university: (0, import_fields5.relationship)({ ref: "University", many: false, isFilterable: true }),
    course: (0, import_fields5.relationship)({ ref: "Course.papers", many: false, isFilterable: true }),
    competitivePaper: (0, import_fields5.relationship)({ ref: "CompetitivePaper.papers" })
  },
  hooks: {
    resolveInput: async ({ operation, context, resolvedData }) => {
      if (resolvedData.original.filename)
        resolvedData.source = {
          "mode": "local",
          ...await modifyPdf(resolvedData.original.filename, context.session?.data?.name)
        };
      return resolvedData;
    }
  }
});

// schemas/CompetitivePaper.ts
var import_fields6 = require("@keystone-6/core/fields");
var import_core5 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var CompetitivePaper = (0, import_core5.list)({
  access: import_access5.allowAll,
  fields: {
    name: (0, import_fields6.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields6.text)({ isFilterable: true }),
    papers: (0, import_fields6.relationship)({ ref: "Paper.competitivePaper", many: true, isFilterable: true })
  }
});

// schemas/index.ts
var lists = {
  User,
  University,
  Course,
  Paper,
  CompetitivePaper
};

// keystone.ts
import_dotenv.default.config();
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "The SESSION_SECRET environment variable must be set in production"
    );
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --";
  }
}
var sessionMaxAge = 60 * 60 * 24 * 30;
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  sessionData: "id name role status",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});
var keystone_default = withAuth(
  (0, import_core6.config)({
    db: {
      provider: "postgresql",
      url: process.env.DATABASE_URL || "",
      onConnect: async () => {
        console.log("CONNECTED TO DB");
      }
    },
    server: {
      maxFileSize: 10 * 1024 * 1024,
      cors: {
        origin: [process.env.FRONTEND_URL || "http://localhost:3001"],
        credentials: true
      }
    },
    ui: {
      isAccessAllowed: (context) => context.req?.url?.startsWith("/files") ? true : !!context.session?.data
    },
    lists,
    session,
    storage: {
      localImages: {
        kind: "local",
        type: "image",
        generateUrl: (path2) => `http://localhost:3000/images${path2}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      },
      localFiles: {
        kind: "local",
        type: "file",
        generateUrl: (path2) => `http://localhost:3000/files${path2}`,
        serverRoute: {
          path: "/files"
        },
        storagePath: "public/files"
      }
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
