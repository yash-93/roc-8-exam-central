import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

export const CompetitivePaper = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: text({ isFilterable: true }),
    papers: relationship({ ref: 'Paper.competitivePaper', many: true, isFilterable: true })
  }
})
