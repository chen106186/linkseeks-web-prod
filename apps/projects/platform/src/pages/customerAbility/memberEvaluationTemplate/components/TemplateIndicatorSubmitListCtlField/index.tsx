import React, { useMemo, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'

import { Button, Drawer, message, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import PolymericTable from '@/components/PolymericTable'
import { I_Indicator } from '../TemplateIndicatorSubmitListField'

import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { drawerQuerySchema } from './schema'

import {
  getMemberCustomerScoringIndicatorToAssignedPage,
  GetMemberCustomerScoringIndicatorToAssignedPageRequest,
} from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import styles from './index.less'

interface I_TemplateIndicatorSubmitListCtlField_Props {}

const EMPTY_DATA = {
  data: [],
  totalCount: 0,
}

const TemplateIndicatorSubmitListCtlField = (props: any) => {
  const { value, schema, editable, mutators } = props
  const {}: I_TemplateIndicatorSubmitListCtlField_Props = schema.getExtendsComponentProps() || {}

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [drawerSelectedRows, setDrawerSelectedRows] = useState<Array<I_Indicator>>([])
  const translate = useWebIntl()

  const drawerTableColumns: ColumnsType<any> = useMemo(
    () =>
      [
        {
          title: translate('web.resource.member.zhibiaofenzu'),
          dataIndex: 'indicatorGrouping',
          width: 160,
        },
        {
          title: translate('web.resource.member.biaozhunzhibiao'),
          dataIndex: 'standardIndicator',
          width: 256,
        },
        {
          title: translate('web.resource.member.fenzhifanwei'),
          dataIndex: 'scoreMin',
          width: 256,
          render: (scoreMin, indicator) => (
            <span>
              {scoreMin} ~ {indicator.scoreMax}
            </span>
          ),
        },
        {
          title: translate('web.resource.member.biaozhunzhibiaoshuoming'),
          dataIndex: 'indicatorDescribe',
          width: 256,
        },
      ].map((column) => ({ ...column, ellipsis: true })),
    [],
  )

  /** 查询 未配置的评分模板列表 */
  const getUnassignedEvaluationTemplates = async (
    params: GetMemberCustomerScoringIndicatorToAssignedPageRequest,
  ): Promise<any> => {
    try {
      const res = await getMemberCustomerScoringIndicatorToAssignedPage({ ...params })
      if (res.code === 1000 && Array.isArray(res.data)) {
        return {
          data: res.data,
          totalCount: 0, // 接口没有分页
        }
      }
      return EMPTY_DATA
    } catch (error) {
      console.error(error)
      return EMPTY_DATA
    }
  }

  const onDrawerSelectionFinished = () => {
    if (drawerSelectedRows.length) {
      setIsSubmitting(true)
      mutators.change([])
      setTimeout(() => {
        mutators.change(drawerSelectedRows)
        onDrawerClosed()
      }, 600)
    } else {
      message.warning(translate('web.resource.member.qingxuanzebiaozhunzhibiao'))
    }
  }

  const onDrawerClosed = () => {
    setIsSubmitting(false)
    setIsDrawerVisible(false)
    setDrawerSelectedRows([])
  }

  return (
    <div className={styles['configuration-wrap']}>
      <Button
        disabled={!editable}
        className={styles['drawer-controlling-button']}
        icon={<PlusOutlined />}
        onClick={() => setIsDrawerVisible(true)}
      >
        {translate('web.resource.member.xuanzebiaozhunzhibiao')}
      </Button>

      <Drawer
        width={1200}
        destroyOnClose
        closable={false}
        visible={isDrawerVisible}
        maskClosable={!isSubmitting}
        onClose={onDrawerClosed}
        title={
          <span style={{ color: '#252D37', fontSize: 16, fontWeight: 500 }}>
            {translate('web.resource.member.xuanzepinfenxiangmu')}
          </span>
        }
        extra={
          <CloseOutlined style={{ color: '#91959B', fontSize: 24 }} onClick={isSubmitting ? void 0 : onDrawerClosed} />
        }
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button style={{ border: 'none' }} disabled={isSubmitting} onClick={onDrawerClosed}>
                {translate('web.common.cancel')}
              </Button>
              <Button type="primary" loading={isSubmitting} onClick={onDrawerSelectionFinished}>
                {translate('web.common.confirm')}
              </Button>
            </Space>
          </div>
        }
      >
        <PolymericTable
          full
          rowKey="id"
          pagination={null}
          columns={drawerTableColumns}
          fetchDataSource={getUnassignedEvaluationTemplates}
          rowSelection={{
            selectedRowKeys: drawerSelectedRows.map((row) => row.id),
            onChange: (selectedRowKeys, selectedRows: Array<I_Indicator>) => setDrawerSelectedRows(selectedRows),
          }}
          searchFormProps={{
            schema: drawerQuerySchema,
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'indicatorGrouping', FORM_FILTER_PATH)
            },
          }}
        />
      </Drawer>
    </div>
  )
}

TemplateIndicatorSubmitListCtlField.isFieldComponent = true

export default TemplateIndicatorSubmitListCtlField
