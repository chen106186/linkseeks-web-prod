import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useState } from 'react'
import { Button, Row, Col, Tag, Badge } from 'antd'
import { history } from '@linkseeks/router-manager'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingMerchantActivityGetActivityTypeList,
  getMarketingMerchantActivityPageExamineStep2,
  postMarketingMerchantActivityExamineStep2Batch,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
const { onFormMount$ } = FormEffectHooks
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const menuCode = 'marketingAbility'
const ReadyExamineTwo = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const fetchSubmitBatch = async () => {
    setSubmitLoading(true)
    await postMarketingMerchantActivityExamineStep2Batch({ idList: rowkeys })
      .then((res) => {
        if (res.code !== 1000) {
          setSubmitLoading(false)
          return
        }
        ref.current.reloadCurrent()
        setRowKeys([])
        setSubmitLoading(false)
      })
      .catch((_e) => {
        setSubmitLoading(false)
      })
  }

  const columns: ColumnType<any>[] = [
    {
      title: `${intl.formatMessage({ id: 'selfManagement.activityID' })}`,
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.theNameOfTheEvent' })}`,
      key: 'activityName',
      dataIndex: 'activityName',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/marketingAbility/selfManagement/readyExamineTwo/detail?id=${record.id}&preview=1`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.theActivityType' })}`,
      key: 'activityType',
      dataIndex: 'activityType',
      render: (_text, record) => <>{record.activityTypeName}</>,
    },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.activitiesStartTime' })}`,
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.activityOverTime' })}`,
      key: 'endTime',
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    // {
    //   title: `${intl.formatMessage({ id: 'selfManagement.externalState' })}`,
    //   key: 'outerStatus',
    //   dataIndex: 'outerStatus',
    //   render: (_text, record) => (
    //     <Tag color={OuterStatusColor(_text)}>{record.outerStatusName}</Tag>
    //   )
    // },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.internalState' })}`,
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (_text, record) => <Badge status={InnerStatusColor(_text)} text={record.innerStatusName} />,
    },
    {
      title: `${intl.formatMessage({ id: 'selfManagement.operation' })}`,
      key: 'state',
      dataIndex: 'state',
      render: (_, record) => (
        <AuthButton type="custom" code="examine">
          <Button
            type="link"
            onClick={() => history.push(`/marketingAbility/selfManagement/readyExamineTwo/detail?id=${record.id}`)}
          >
            {intl.formatMessage({ id: 'selfManagement.audit' })}
          </Button>
        </AuthButton>
      ),
    },
  ]

  const useStateEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      /** 活动类型 */
      getMarketingMerchantActivityGetActivityTypeList()
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.status }
          })
          linkage.enum('activityType', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
    })
  }

  return (
    <TableLayout
      reload={ref}
      selectedRow
      fetchRowkeys={(e) => setRowKeys(e)}
      columns={columns}
      effects="activityName"
      fetch={getMarketingMerchantActivityPageExamineStep2}
      useStateEffects={useStateEffects}
      schema={{
        type: 'object',
        properties: {
          megalayout: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                justifyContent: 'space-between',
              },
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              activityName: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'selfManagement.theNameOfTheEvent' })}`,
                  align: 'flex-left',
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
              },
              colStyle: {
                marginLeft: 0,
              },
            },
            properties: {
              PRO_LAYOUT: {
                type: 'object',
                'x-component': 'flex-layout',
                'x-mega-props': {
                  span: 5,
                },
                'x-component-props': {
                  rowStyle: {
                    justifyContent: 'flex-start',
                    flexWrap: 'nowrap',
                  },
                  colStyle: {
                    //改变间隔
                    marginRight: 20,
                  },
                },
                properties: {
                  id: {
                    type: 'number',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'selfManagement.activityID' })}`,
                      style: {
                        width: 160,
                      },
                    },
                  },
                  '[startTime,endTime]': {
                    type: 'daterange',
                    'x-component-props': {
                      placeholder: [
                        `${intl.formatMessage({ id: 'selfManagement.theStartTime' })}`,
                        `${intl.formatMessage({ id: 'selfManagement.theEndOfTime' })}`,
                      ],
                      style: {
                        width: 240,
                      },
                    },
                  },
                  activityType: {
                    type: 'string',
                    'x-component-props': {
                      placeholder: `${intl.formatMessage({ id: 'selfManagement.theActivityType' })}`,
                      style: {
                        width: 160,
                      },
                    },
                    enum: [],
                  },
                },
              },
              sumbit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: `${intl.formatMessage({ id: 'selfManagement.theQuery' })}`,
                },
              },
            },
          },
        },
      }}
      controllerBtns={
        <Row>
          <Col span={6}>
            <AuthButton type="custom" code="batch">
              <Button loading={submitLoading} onClick={fetchSubmitBatch} disabled={rowkeys.length === 0}>
                {intl.formatMessage({ id: 'selfManagement.batchSubmitAudit' })}
              </Button>
            </AuthButton>
          </Col>
        </Row>
      }
    />
  )
}
export default ReadyExamineTwo
