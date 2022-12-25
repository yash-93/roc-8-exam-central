import { config } from '@keystone-6/core';
import dotenv from 'dotenv';
import { statelessSessions } from '@keystone-6/core/session';
import { createAuth } from '@keystone-6/auth';

import { lists } from './schemas';

dotenv.config();

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  sessionData: 'id name role status',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
  sameSite: 'none'
});

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL || '',
      useMigrations: true,
      onConnect: async () => {
        console.log('CONNECTED TO DB');
      }
    },
    server: {
      maxFileSize: 10 * 1024 * 1024,
      cors: {
        origin: [process.env.FRONTEND_URL || 'http://localhost:3001'],
        credentials: true
      },
    },
    ui: {
      isAccessAllowed: (context) => context.req?.url?.startsWith('/files') ? true : !!context.session?.data,
    },
    lists,
    session,
    storage: {
      localImages: {
        kind: 'local',
        type: 'image',
        generateUrl: path => `/images${path}`,
        serverRoute: {
          path: '/images',
        },
        storagePath: 'public/images'
      },
      localFiles: {
        kind: 'local',
        type: 'file',
        generateUrl: path => `/files${path}`,
        serverRoute: {
          path: '/files',
        },
        storagePath: 'public/files'
      },
    },
    graphql: {
      playground: true,
      apolloConfig: {
        introspection: true
      }
    },
  })
);
