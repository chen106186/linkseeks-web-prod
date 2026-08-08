import { ISchema } from '@apps/formily'
import useAssessmentProjectSchema from '../../common/schemas/useAssessmentProjectSchema2'

export const createSchema = (rater: boolean, summay: boolean): ISchema => {
  return {
    type: 'object',
    properties: {
      assessmentProject: {
        type: 'array',
        'x-component': 'TagsPane',
        'x-component-props': {
          tags: [],
        },
        items: useAssessmentProjectSchema(rater, summay),
      },
    },
  }
}
