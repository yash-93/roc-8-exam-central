import { float, integer, relationship, select, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';

import { slug } from '../utils/slug';
import { rules, isSignedIn } from './access/course';

export const Course = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      query: () => true
    },
    filter: {
      query: rules.canReadCourses,
      // update: rules.papersUpdateFilter
    },
    item: {
      create: isSignedIn,
      update: rules.canUpdateCourses,
      delete: rules.canDeleteCourses
    }
  },
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
