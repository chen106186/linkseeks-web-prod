/**
 * 系统能力 - 流程引擎 - 查看售后(B2B)流程规则配置
 * @author: Crayon
 */
import React from 'react'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import AddEditContent from './components/AddEditContent'

const Edit: React.FC = () => {
  const { id } = useQuery()
  const intl = useIntl()

  return (
    <AddEditContent
      pageType="view"
      id={id}
      title={intl.formatMessage({
        id: 'menu.systemAbility.processManagement.afterSalesB2BProcess.detail',
        defaultMessage: '查看售后(B2B)流程规则配置',
      })}
      btnCode="submit"
    />
  )
}

export default Edit
