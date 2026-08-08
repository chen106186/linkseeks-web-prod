import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space } from 'antd'
import Statement from '@/components/Statement'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { isEmpty } from 'lodash'

/**
 * 供应商能力 投诉报表
 */

const action = createFormActions()

const Index = () => {
  const intl = useIntl()
  const [params, setParams] = useState({})

  const presuppose = {
    [intl.formatMessage({ id: 'order.statistics.today' })]: [moment(), moment()],
    [intl.formatMessage({ id: 'order.statistics.oneWeek' })]: [moment().startOf('week'), moment().endOf('week')],
    [intl.formatMessage({ id: 'order.statistics.oneMonth' })]: [moment().startOf('month'), moment().endOf('month')],
    [intl.formatMessage({ id: 'order.statistics.threeMonth' })]: [
      moment(new Date()).subtract(2, 'months').startOf('month'),
      moment().endOf('month'),
    ],
    [intl.formatMessage({ id: 'order.statistics.halfYear' })]: [
      moment(new Date()).subtract(5, 'months').startOf('month'),
      moment().endOf('month'),
    ],
  }

  const handleSubmit = (values) => {
    const obj = { ...values }
    for (const key in obj) {
      if (isEmpty(obj[key])) {
        delete obj[key]
      }
      if (moment.isMoment(obj[key])) {
        obj[key] = moment(obj[key]).format('YYYY-MM-DD')
      }
    }
    setParams(obj)
  }

  const handleReset = () => {
    setParams({})
  }

  useEffect(() => {
    // 调用默认查询
    action.submit()
  }, [])

  const searchSchema = {
    type: 'object',
    properties: {
      flexLayout: {
        type: 'object',
        'x-component': 'flex-layout',
        'x-component-props': {
          className: 'order_srm_element',
          rowStyle: {
            flexWrap: 'nowrap',
          },
          colStyle: {
            marginLeft: 20,
          },
        },
        properties: {
          '[startDate, endDate]': {
            title: intl.formatMessage({ id: 'order.statistics.timeRange' }),
            'x-component': 'DateRangePicker',
            'x-component-props': {
              placeholder: [
                intl.formatMessage({ id: 'order.statistics.startDate' }),
                intl.formatMessage({ id: 'order.statistics.endDate' }),
              ],
              allowClear: true,
              showTime: false,
              ranges: '{{presuppose}}',
              // 窗口固定父级下面
              getPopupContainer: (triggerNode) => triggerNode.parentNode,
            },
            default: [moment().subtract(59, 'day').startOf('day'), moment().startOf('day')],
          },
          submit: {
            'x-component': 'Submit',
            'x-component-props': {
              children: intl.formatMessage({ id: 'trademark.schema.submit' }),
            },
          },
          reset: {
            'x-component': 'Reset',
            'x-component-props': {
              advanced: false,
              children: intl.formatMessage({ id: 'common.button.reset' }),
            },
          },
        },
      },
    },
  }

  return (
    <PageHeaderWrapper>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card>
          <NiceForm
            actions={action}
            schema={searchSchema}
            onSubmit={(values) => handleSubmit(values)}
            onReset={handleReset}
            expressionScope={{
              presuppose,
            }}
          />
        </Card>
        <Card>
          <Statement url="/superset/dashboard/complaint" params={params} />
        </Card>
      </Space>
    </PageHeaderWrapper>
  )
}
export default Index
