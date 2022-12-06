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
var import_core3 = require("@keystone-6/core");
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
    reasonFlagged: (0, import_fields.text)()
  },
  access: import_access.allowAll
});

// schemas/University.ts
var import_fields2 = require("@keystone-6/core/fields");
var import_core2 = require("@keystone-6/core");
var import_access2 = require("@keystone-6/core/access");
var University = (0, import_core2.list)({
  access: import_access2.allowAll,
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true }, isFilterable: true }),
    city: (0, import_fields2.text)({ validation: { isRequired: true } }),
    state: (0, import_fields2.text)({ validation: { isRequired: true } }),
    country: (0, import_fields2.text)({ validation: { isRequired: true } }),
    banner: (0, import_fields2.image)({ storage: "localImages" }),
    logo: (0, import_fields2.image)({ storage: "localImages" }),
    status: (0, import_fields2.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      ui: {
        displayMode: "segmented-control"
      }
    })
  }
});

// schemas/index.ts
var lists = {
  User,
  University
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
  (0, import_core3.config)({
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
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      },
      localFiles: {
        kind: "local",
        type: "file",
        generateUrl: (path) => `http://localhost:3000/files${path}`,
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
