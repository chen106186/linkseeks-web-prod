import { useIntl } from '@linkseeks/i18n'
import React, { useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import TableLayout from '@/components/TableLayout'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import StatusTag from '@/components/StatusTag'
import { Button, Popconfirm, Row, Col, Tag, Badge } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingPlatformActivitySignupGetActivityTypeList,
  getMarketingPlatformActivitySignupPageTobeSubmit,
  postMarketingPlatformActivitySignupSubmit,
  postMarketingPlatformActivitySignupSubmitBatch,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
const { onFormMount$ } = FormEffectHooks
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const ReadySubmitExamine = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  /** 提交审核 */
  const handleSubmit = async (signUpId?: number) => {
    await postMarketingPlatformActivitySignupSubmit({ id: signUpId }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reloadCurrent()
    })
  }

  const fetchSubmitBatch = async () => {
    const res = await postMarketingPlatformActivitySignupSubmitBatch({ ids: rowkeys })
    setSubmitLoading(true)
    if (res.code !== 1000) {
      setSubmitLoading(false)
      return
    }
    setSubmitLoading(false)
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
            url={`/marketingAbility/paltformSign/readySubmitExamine/detail?activityId=${record.activityId}&signUpId=${record.id}&preview=true`}
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
        <>
          {record.update && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/marketingAbility/paltformSign/readySubmitExamine/edit?activityId=${record.activityId}&signUpId=${record.id}`,
                  )
                }
              >
                {intl.formatMessage({ id: 'paltformSign.modifyTheRegistrationInformation' })}
              </Button>
            </AuthButton>
          )}
          {record.submit && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                title={intl.formatMessage({ id: 'paltformSign.sureToSummit' })}
                disabled={!record.id}
                okText={intl.formatMessage({ id: 'paltformSign.is' })}
                cancelText={intl.formatMessage({ id: 'paltformSign.no' })}
                onConfirm={() => handleSubmit(record.id)}
              >
                <Button type="link" disabled={!record.id}>
                  {intl.formatMessage({ id: 'paltformSign.submitAudit' })}
                </Button>
              </Popconfirm>
            </AuthButton>
          )}
          {record.save && (
            <AuthButton type="custom" code="save">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/marketingAbility/paltformSign/readySubmitExamine/add?activityId=${record.activityId}`)
                }
              >
                {intl.formatMessage({ id: 'paltformSign.fillInTheRegistrationInformation' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

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

  const getCheckboxProps = (record) => {
    return { disabled: !record.id }
  }

  return (
    <TableLayout
      reload={ref}
      selectedRow
      fetchRowkeys={(e) => {
        setRowKeys(e)
        console.log(e)
      }}
      getCheckboxProps={getCheckboxProps}
      columns={columns}
      effects="activityName"
      activeKey="id"
      // rowKey="activityId"
      fetch={getMarketingPlatformActivitySignupPageTobeSubmit}
      controllerBtns={controllerBtns}
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
                  inline: true,
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
export default ReadySubmitExamine
