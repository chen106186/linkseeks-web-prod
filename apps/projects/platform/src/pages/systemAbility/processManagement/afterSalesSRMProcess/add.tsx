/**
 * 系统能力 - 流程引擎 - 新增售后(SRM)流程规则配置
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
        id: 'menu.systemAbility.processManagement.afterSalesSRMProcess.add',
        defaultMessage: '新增售后(SRM)流程规则配置',
      })}
      btnCode="submit"
    />
  )
}

export default Add
