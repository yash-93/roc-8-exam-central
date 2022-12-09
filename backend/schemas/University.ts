import { image, relationship, select, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
// import { customAlphabet } from 'nanoid';

import { slug } from '../utils/slug';
import { rules, isSignedIn } from './access/university';

// const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
// const nanoid = customAlphabet(alphabet, 6);

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
    // slug: text({
    //   hooks: {
    //     resolveInput: ({ inputData }) => {
    //       let input = inputData?.name || inputData?.title || 'new-item';
    //       input = input
    //         .trim()
    //         .toLowerCase()
    //         .replace(/[^\w ]+/g, '')
    //         .replace(/ +/g, '-') ?? ''
    //       return (
    //         input + nanoid()
    //       );
    //     }
    //   },
    //   ui: { createView: { fieldMode: 'hidden' } }
    // }),
    slug: slug(),
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
