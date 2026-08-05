import { useIntl } from '@linkseeks/i18n'
import React, { useState, useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import StatusTag from '@/components/StatusTag'
import { Button, Space, Popconfirm, Tag, Badge } from 'antd'
import { formatTimeString } from '@/utils'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingPlatformActivitySignupGetActivityTypeList,
  getMarketingPlatformActivitySignupPageTobeSubmitSignUp,
  postMarketingPlatformActivitySignupSubmitSignUp,
  postMarketingPlatformActivitySignupSubmitSignUpBatch,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
const { onFormMount$ } = FormEffectHooks
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const ReadySubmit = () => {
  const intl = useIntl()

  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  /** 批量审核 */
  const fetchSubmitBatch = async (id?: number) => {
    let res = null
    if (id) {
      res = await postMarketingPlatformActivitySignupSubmitSignUp({ id })
    } else {
      res = await postMarketingPlatformActivitySignupSubmitSignUpBatch({ ids: rowkeys })
    }
    setConfirmLoading(true)
    if (res.code !== 1000) {
      setConfirmLoading(false)
      return
    }
    setConfirmLoading(false)
    ref.current.reloadCurrent()
    setRowKeys([])
  }

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
            url={`/marketingAbility/paltformSign/readySubmit/detail?activityId=${record.activityId}&signUpId=${record.id}&preview=true`}
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
      render: (text, record) => <Badge status={InnerStatusColor(text)} text={record.innerStatusName} />,
    },
    {
      title: `${intl.formatMessage({ id: 'paltformSign.operation' })}`,
      key: 'state',
      dataIndex: 'state',
      render: (text, record) => (
        <AuthButton type="custom" code="examine">
          <Popconfirm
            title={intl.formatMessage({ id: 'marketingAbility.quedingyaotijiaoma？' })}
            okButtonProps={{ loading: confirmLoading }}
            disabled={!record.id}
            okText={intl.formatMessage({ id: 'paltformSign.is' })}
            cancelText={intl.formatMessage({ id: 'paltformSign.no' })}
            onConfirm={() => fetchSubmitBatch(record.id)}
          >
            <Button type="link" disabled={!record.id}>
              {intl.formatMessage({ id: 'paltformSign.submit' })}
            </Button>
          </Popconfirm>
        </AuthButton>
      ),
    },
  ]

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
      columns={columns}
      effects="activityName"
      // rowKey="activityId"
      fetch={getMarketingPlatformActivitySignupPageTobeSubmitSignUp}
      selectedRow={true}
      fetchRowkeys={(e) => setRowKeys(e)}
      controllerBtns={
        <Space>
          <AuthButton type="custom" code="batch">
            <Button loading={confirmLoading} disabled={rowkeys.length === 0} onClick={() => fetchSubmitBatch()}>
              {intl.formatMessage({ id: 'paltformSign.batchSubmission' })}
            </Button>
          </AuthButton>
        </Space>
      }
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
              colStyle: {},
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
                },
              },
              sumbit: {
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
export default ReadySubmit
