import { float, integer, relationship, select, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

import { slug } from '../utils/slug';

export const Course = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true }, isFilterable: true }),
    slug: slug(),
    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    courseCode: text({ validation: { isRequired: true } }),
    duration: float({ validation: { isRequired: true } }),
    noOfSemester: integer(),
    semesterSystem: select({
      options: [
        { label: 'Annual', value: '1' },
        { label: 'Semester', value: '2' },
        { label: 'Trimester', value: '3' },
        { label: 'Quarter Semester', value: '4' }
      ],
      defaultValue: '2'
    }),
    papers: relationship({ ref: 'Paper.course', many: true }),
    university: relationship({ ref: 'University.courses', many: false, isFilterable: true })
  }
})
