/**
 * 系统能力 - 流程引擎 - 新增生命周期变更流程规则配置
 * @author: Crayon
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import AddEditContent from './components/AddEditContent'

const Add: React.FC = () => {
  const intl = useIntl()

  return (
    <AddEditContent
      pageType="add"
      title={intl.formatMessage({
        id: 'menu.systemAbility.processManagement.lifecycleChangeProcess.add',
        defaultMessage: '新增生命周期变更流程规则配置',
      })}
      btnCode="submit"
    />
  )
}

export default Add
