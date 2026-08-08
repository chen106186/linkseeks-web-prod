/*
 * @Description: 考评项目控制器Field组件
 */
import React, { useMemo, useState, useEffect } from 'react'
import { Button, Drawer, message } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import {
  getMemberSupplierScoringTemplateDetail,
  getMemberSupplierScoringTemplatePage,
  GetMemberSupplierScoringTemplatePageResponse,
} from '@apps/apis'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { useWebIntl } from '@apps/locales'
import { querySchema } from './querySchema'
import styles from './index.less'

export type AssessmentTemplateType = GetMemberSupplierScoringTemplatePageResponse & {}

interface EvaluationsAssessmentProjectCtlFieldProps {}

type ExtraFetchType = FetchParamsType & {
  /**
   * 评分模板名称
   */
  templateName: string
}

export type EvaluatorValueType = {
  /**
   * 评分人id
   */
  userId: number
  /**
   * 评分人姓名
   */
  userName: string
}[]

export type AssessmentProjectCtlValueType = {
  /**
   * 分组名称
   */
  groupName: string
  /**
   * 分组内元素
   */
  elements?: {
    /**
     * id
     */
    id?: number
    /**
     * 指标分组
     */
    indicatorGrouping: string
    /**
     * 标准指标
     */
    standardIndicator: string
    /**
     * 分值范围
     */
    scoreRange: string
    /**
     * 最小分值
     */
    scoreMin: number
    /**
     * 最大分值
     */
    scoreMax: number
    /**
     * 分值标准
     */
    scoreStandard: string
    /**
     * 权重
     */
    weight: number
    /**
     * 排序
     */
    sort?: number
  }[]
}[]

const EvaluationsAssessmentProjectCtlField = (props) => {
  const { schema, editable, value } = props
  const componentProps: EvaluationsAssessmentProjectCtlFieldProps = schema.getExtendsComponentProps() || {}

  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: 'id' })

  const translate = useWebIntl()
  const intl = useIntl()

  const columns: ColumnType<AssessmentTemplateType>[] = useMemo(
    () => [
      {
        title: translate('web.resource.member.pingfenmubanid'),
        dataIndex: 'id',
      },
      {
        title: translate('web.resource.member.pingfenmubanmingcheng'),
        dataIndex: 'templateName',
      },
      {
        title: translate('web.resource.member.pingfenmubanleixing'),
        dataIndex: 'templateTypeName',
      },
      {
        title: translate('web.resource.member.pingfenmubanshuoming'),
        dataIndex: 'templateDescribe',
      },
    ],
    [],
  )

  const fetchTemplateList = async (params: ExtraFetchType) => {
    const res = await getMemberSupplierScoringTemplatePage(
      {
        ...(params as any),
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return {
        data: res.data,
        totalCount: res.data.length,
      }
    }
    return { data: [], totalCount: 0 }
  }

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleConfirm = async () => {
    if (!rowCtl.selectRow.length) {
      message.warning('请选择评分模版')
      return
    }
    if (props.mutators.change) {
      const template = rowCtl.selectRow[0]
      try {
        setConfirming(true)
        const res = await getMemberSupplierScoringTemplateDetail({
          templateId: template.id,
        })
        if (res.code === 1000) {
          props.mutators.change(res.data.templateIndicatorGroups)
          handleVisibleDrawer(false)
        }
      } catch (error) {
      } finally {
        setConfirming(false)
      }
    }
  }

  if (!editable) {
    return null
  }

  return (
    <div className={styles['modifies-evaluator']}>
      <Button onClick={() => handleVisibleDrawer(true)} icon={<PlusOutlined />}>
        {translate('web.resource.member.xuanzepinfenmuban')}
      </Button>
      <Drawer
        title={translate('web.resource.member.xuanzepinfenmuban')}
        open={visibleDrawer}
        width={800}
        onClose={() => handleVisibleDrawer(false)}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
            </Button>
            <Button onClick={handleConfirm} type="primary" loading={confirming}>
              {intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })}
            </Button>
          </div>
        }
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <PolymericTable
          rowKey="id"
          columns={columns}
          fetchDataSource={(params) => fetchTemplateList(params as ExtraFetchType)}
          rowSelection={rowSelection}
          defaultPageSize={20}
          searchFormProps={{
            schema: querySchema,
            effects: ($, actions) => {},
          }}
          pagination={null}
          full
        />
      </Drawer>
    </div>
  )
}

EvaluationsAssessmentProjectCtlField.isFieldComponent = true

export default EvaluationsAssessmentProjectCtlField
