import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import TableLayout from '@/components/TableLayout'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import StatusTag from '@/components/StatusTag'
import { Badge, Button, Col, Row, Space, Tag } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingPlatformActivitySignupGetActivityTypeList,
  getMarketingPlatformActivitySignupPageTobeExamineStep1,
  postMarketingPlatformActivitySignupExamineStep1Batch,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { onFormMount$ } = FormEffectHooks

const ReadyExamineOne = () => {
  const intl = useIntl()

  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'paltformSign.activityID' }),
      key: 'activityId',
      dataIndex: 'activityId',
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.theNameOfTheEvent' })}`,
      key: 'activityName',
      dataIndex: 'activityName',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/marketingAbility/paltformSign/readyExamineOne/detail?activityId=${record.activityId}&signUpId=${record.id}&preview=true`}
          >
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`,
      key: 'activityType',
      dataIndex: 'activityType',
      render: (_text, record) => <>{record.activityTypeName}</>,
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.activitiesStartTime' })}`,
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.activityOverTime' })}`,
      key: 'endTime',
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.startTimeSigningUp' })}`,
      key: 'signUpStartTime',
      dataIndex: 'signUpStartTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.endTimeSigningUp' })}`,
      key: 'signUpEndTime',
      dataIndex: 'signUpEndTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.externalState' })}`,
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      render: (_, record) => <Tag color={OuterStatusColor(_)}>{record.outerStatusName}</Tag>,
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.internalState' })}`,
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (_, record) => <Badge status={InnerStatusColor(_)} text={record.innerStatusName} />,
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
      key: 'state',
      dataIndex: 'state',
      render: (_, record) => (
        <AuthButton type="custom" code="examine">
          <Button
            type="link"
            onClick={() =>
              history.push(
                `/marketingAbility/paltformSign/readyExamineOne/detail?activityId=${record.activityId}&signUpId=${record.id}`,
              )
            }
          >
            {intl.formatMessage({ id: 'paltformSign.audit' })}
          </Button>
        </AuthButton>
      ),
    },
  ]

  const fetchSubmitBatch = async () => {
    const res = await postMarketingPlatformActivitySignupExamineStep1Batch({ ids: rowkeys })
    setSubmitLoading(true)
    if (res.code !== 1000) {
      setSubmitLoading(false)
      return
    }
    setSubmitLoading(false)
    ref.current.reloadCurrent()
    setRowKeys([])
  }

  /* 操作按钮 */
  const controllerBtns = (
    <Row>
      <Col span={6}>
        <AuthButton type="custom" code="batch">
          <Button disabled={rowkeys.length === 0} loading={submitLoading} onClick={() => fetchSubmitBatch()}>
            {intl.formatMessage({ id: 'paltformSign.batchSubmitAudit' })}
          </Button>
        </AuthButton>
      </Col>
    </Row>
  )

  const useStateEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      /** 活动类型 */
      getMarketingPlatformActivitySignupGetActivityTypeList()
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
      // rowKey="activityId"
      fetch={getMarketingPlatformActivitySignupPageTobeExamineStep1}
      controllerBtns={controllerBtns}
      schema={{
        type: 'object',
        properties: {
          topLayout: {
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
            'x-component': 'Flex-Layout',
            'x-component-props': {
              colStyle: {
                marginLeft: 20,
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
                    `${intl.formatMessage({ id: 'paltformSign.theStartTime' })}`,
                    `${intl.formatMessage({ id: 'paltformSign.theEndOfTime' })}`,
                  ],
                  style: {
                    width: 240,
                  },
                },
              },
              activityType: {
                type: 'string',
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'paltformSign.theActivityType' })}`,
                  style: {
                    width: 160,
                  },
                },
                enum: [],
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: `${intl.formatMessage({ id: 'paltformSign.theQuery' })}`,
                },
              },
            },
          },
        },
      }}
      useStateEffects={useStateEffects}
    />
  )
}
export default ReadyExamineOne
