import { ISchema } from '@apps/formily'
import useAssessmentResultSchema from '../../common/schemas/useAssessmentResultSchema'

export const createSchema = (): ISchema => {
  return {
    type: 'object',
    properties: {
      MEGA_LADYOUT_1: {
        type: 'object',
        'x-component': 'Mega-Layout',
        'x-component-props': {
          grid: true,
          full: true,
          columns: 2,
          autoRow: true,
          labelCol: 6,
          labelAlign: 'left',
        },
        ...useAssessmentResultSchema(),
      },
    },
  }
}
