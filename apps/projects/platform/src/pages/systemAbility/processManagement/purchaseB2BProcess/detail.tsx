/**
 * 系统能力 - 流程引擎 - 查看采购订单(B2B)流程规则配置
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
        id: 'menu.systemAbility.processManagement.purchaseB2BProcess.detail',
        defaultMessage: '采购订单(B2B)流程规则配置详情',
      })}
      btnCode="submit"
    />
  )
}

export default Edit
