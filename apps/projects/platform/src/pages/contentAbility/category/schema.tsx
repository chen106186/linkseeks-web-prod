import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Tooltip } from '@linkseeks/ui'
import { QuestionCircleIcon } from '@linkseeks/icons'
import styles from './index.less'

export const classSchema = (): ISchema => {
  const intl = getIntl()

  return {
    type: 'object',
    properties: {
      megaLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          grid: true,
          columns: 16,
          labelAlign: 'top',
        },
        properties: {
          noField1: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              full: true,
              wrapperWidth: 507,
            },
            'x-mega-props': {
              span: 1,
            },
            properties: {
              name: {
                type: 'string',
                title: intl.formatMessage({ id: 'content.category.name' }),
                required: true,
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'common.form.input.placeholder' })}${intl.formatMessage({
                    id: 'content.category.name',
                  })}`,
                },
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 20,
                  },
                ],
              },
              describe: {
                type: 'textarea',
                title: intl.formatMessage({ id: 'content.category.type' }),
                'x-component-props': {
                  placeholder: `100${intl.formatMessage({
                    id: 'common.unit.individual.character',
                  })}，50${intl.formatMessage({ id: 'common.unit.individual.chinese' })}`,
                },
                'x-rules': [
                  {
                    limitByte: true,
                    maxByte: 100,
                  },
                ],
              },
              level: {
                type: 'string',
                visible: false,
                'x-linkages': [
                  {
                    type: 'value:visible',
                    target: '*(inlineLayout)',
                    condition: '{{$value === 3}}',
                  },
                ],
              },
              inlineLayout: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  inline: true,
                },
                properties: {
                  status: {
                    title: '',
                    'x-component': 'CheckboxGroup',
                    enum: [
                      {
                        label: (
                          <div className={styles['status-tip']}>
                            <span>{intl.formatMessage({ id: 'content.category.recommend' })}</span>
                            <Tooltip
                              placement="topLeft"
                              title={intl.formatMessage({ id: 'content.category.handleTips' })}
                            >
                              <QuestionCircleIcon size={16} />
                            </Tooltip>
                          </div>
                        ),
                        value: 1,
                      },
                    ],
                    'x-component-props': {
                      addonAfter: '{{showWarn}}',
                    },
                  },
                },
              },

              // status1: {
              //   title: '',
              //   'x-component': 'Children',
              //   "x-component-props": {
              //     "children": "{{renderCheckBox()}}"
              //   }
              // }
            },
          },
        },
      },
    },
  }
}
