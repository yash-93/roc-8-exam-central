import { image, relationship, select, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';

// import { slug } from '../utils/slug';
import { rules, isSignedIn } from './access/university';

export const University = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
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
    name: text({ validation: { isRequired: true }, isFilterable: true }),
    // slug: slug(),
    city: text({ validation: { isRequired: true } }),
    state: text({ validation: { isRequired: true } }),
    country: text({ validation: { isRequired: true } }),
    banner: image({ storage: 'localImages' }),
    logo: image({ storage: 'localImages' }),
    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    courses: relationship({ ref: 'Course.university', many: true })
  }
})
