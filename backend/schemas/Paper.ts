import { file, integer, relationship, select, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

import { modifyPdf } from '../utils/utils';
import { slug } from '../utils/slug';

export const Paper = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: slug(),
    paperCode: text({ validation: { isRequired: true } }),
    year: integer({ validation: { isRequired: true }, isOrderable: true, isFilterable: true }),
    semester: integer({ isFilterable: true }),
    uploadedBy: relationship({ ref: 'User.papers', many: false }),
    type: select({
      options: [
        { label: 'University', value: 'university' },
        { label: 'Competitive', value: 'competitive' }
      ],
      defaultValue: 'university',
      ui: {
        displayMode: 'segmented-control',
      }
    }),
    flag: select({
      options: [
        { label: 'None', value: 'none' },
        { label: 'Duplicate', value: 'duplicate' },
        { label: 'Spam/Junk', value: 'spam' },
        { label: 'Inconsistant', value: 'inconsistant' }
      ],
      defaultValue: 'none'
    }),
    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      defaultValue: 'draft',
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    isActive: select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ],
      defaultValue: 'active',
      ui: {
        displayMode: 'segmented-control',
      }
    }),
    original: file({ storage: 'localFiles' }),
    source: file({ storage: 'localFiles' }),
    university: relationship({ ref: 'University', many: false, isFilterable: true }),
    course: relationship({ ref: 'Course.papers', many: false, isFilterable: true }),
    competitivePaper: relationship({ ref: 'CompetitivePaper.papers' })
  },
  hooks: {
    resolveInput: async ({ operation, context, resolvedData }) => {
      if (resolvedData.original.filename)
        resolvedData.source = {
          ...await modifyPdf(resolvedData.original.filename, context.session?.data?.name)
        }
      return resolvedData;
    }
  }
})
