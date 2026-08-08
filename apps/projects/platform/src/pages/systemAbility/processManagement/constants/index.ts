import { getIntl } from '@linkseeks/i18n'

export const commonTabLink = [
  {
    key: 'processBase',
    label: getIntl().formatMessage({ id: 'processRuleSetting.jibenxinxi', defaultMessage: '基本信息' }),
  },
  {
    key: 'processSelect',
    label: getIntl().formatMessage({ id: 'processRuleSetting.liuchengxuanze', defaultMessage: '流程选择' }),
  },
  {
    key: 'processImage',
    label: getIntl().formatMessage({ id: 'processRuleSetting.liuchengtushi', defaultMessage: '流程图示' }),
  },
  {
    key: 'processRule',
    label: getIntl().formatMessage({ id: 'processRuleSetting.liuchengguize', defaultMessage: '流程规则' }),
  },
]

export const getCommonTabLink = (isDefault?: boolean) => {
  if (isDefault) {
    return commonTabLink.slice(0, 3)
  }
  return commonTabLink
}

export const commonProgressProps = {
  // progressIgnoreConfig: [{ ignoreKey: 'ruleEngineConfigFieldRelations' }],
  progressListFieldsConfig: [
    {
      parentField: 'engineRuleList',
      valueField: ['ruleFieldList'],
      children: {
        parentField: 'ruleFieldList',
        valueField: ['value'],
      },
    },
  ],
}
