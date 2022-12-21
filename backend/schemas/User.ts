import { image, password, relationship, text, select } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

export const User = list({
  ui: {
    listView: {
      initialColumns: ['name', 'role'],
    }
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: text({ isFilterable: true }),
    email: text({ validation: { isRequired: true }, isIndexed: 'unique', isFilterable: true }),
    avatar: image({ storage: 'localImages' }),
    password: password({ validation: { isRequired: true } }),
    role: select({
      validation: { isRequired: true },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Regular', value: 'regular' },
        { label: 'Viewer', value: 'viewer' }
      ],
      defaultValue: 'regular',
      ui: {
        displayMode: 'segmented-control',
      }
    }),
    status: select({
      validation: { isRequired: true },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Flagged', value: 'flagged' },
        { label: 'Suspended', value: 'suspended' }
      ],
      defaultValue: 'active',
      ui: {
        displayMode: 'segmented-control',
      }
    }),
    reasonFlagged: text(),
    bookmarks: relationship({ ref: 'Paper', many: true }),
    papers: relationship({ ref: 'Paper.uploadedBy', many: true })
  },
  access: allowAll
})
