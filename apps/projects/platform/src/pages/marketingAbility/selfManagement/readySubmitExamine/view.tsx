import { useIntl } from '@linkseeks/i18n'

import React, { Fragment, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Row, Col, Space, Popconfirm, Tag, Badge } from 'antd'
import TableLayout from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
const { onFormMount$ } = FormEffectHooks
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingMerchantActivityGetActivityTypeList,
  getMarketingMerchantActivityPageTobeSubmitExam,
  postMarketingMerchantActivityDelete,
  postMarketingMerchantActivityDeleteBatch,
  postMarketingMerchantActivitySubmitExamine,
  postMarketingMerchantActivitySubmitExamineBatch,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const menuCode = 'marketingAbility'
const ReadySubmitExamine = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [rowkeys, setRowKeys] = useState<Array<number>>([])
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const fetchSubmitBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postMarketingMerchantActivitySubmitExamine({ id: Number(id) })
    } else {
      res = await postMarketingMerchantActivitySubmitExamineBatch({ idList: rowkeys })
    }
    setSubmitLoading(true)
    if (res.code !== 1000) {
      setSubmitLoading(false)
      return
    }
    setSubmitLoading(false)
    ref.current.reloadCurrent()
    setRowKeys([])
  }

  const fetchDeleteBatch = async (id?: number) => {
    let res: any = null
    if (id) {
      res = await postMarketingMerchantActivityDelete({ id })
    } else {
      res = await postMarketingMerchantActivityDeleteBatch({ idList: rowkeys })
    }
    setDeleteLoading(true)
    if (res.code !== 1000) {
      setDeleteLoading(false)
      return
    }
    setDeleteLoading(false)
    ref.current.reloadCurrent()
    setRowKeys([])
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
            url={`/marketingAbility/selfManagement/readySubmitExamine/detail?id=${record.id}&preview=1`}
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
      render: (_text, _record) => (
        <Fragment>
          {_record.submit && (
            <AuthButton type="custom" code="submit">
              <Popconfirm
                okButtonProps={{ loading: submitLoading }}
                title={intl.formatMessage({ id: 'selfManagement.sureYouWantToSubmit?' })}
                okText={intl.formatMessage({ id: 'selfManagement.is' })}
                cancelText={intl.formatMessage({ id: 'selfManagement.no' })}
                onConfirm={() => fetchSubmitBatch(_record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'selfManagement.submit' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
          {_record.update && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/marketingAbility/selfManagement/readySubmitExamine/edit?id=${_record.id}`)
                }
              >
                {intl.formatMessage({ id: 'selfManagement.modifyThe' })}
              </Button>
            </AuthButton>
          )}
          {_record.delete && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                okButtonProps={{ loading: deleteLoading }}
                title={intl.formatMessage({ id: 'selfManagement.sureYouWantToDelete?' })}
                okText={intl.formatMessage({ id: 'selfManagement.is' })}
                cancelText={intl.formatMessage({ id: 'selfManagement.no' })}
                onConfirm={() => fetchDeleteBatch(_record.id)}
              >
                <Button type="link">{intl.formatMessage({ id: 'selfManagement.delete' })}</Button>
              </Popconfirm>
            </AuthButton>
          )}
        </Fragment>
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
      selectedRow
      reload={ref}
      columns={columns}
      effects="activityName"
      fetchRowkeys={(e) => setRowKeys(e)}
      fetch={getMarketingMerchantActivityPageTobeSubmitExam}
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
          <Col span={24}>
            <Space direction="horizontal" size={16}>
              <AuthButton type="add" code="add">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => history.push(`/marketingAbility/selfManagement/readySubmitExamine/add`)}
                >
                  {intl.formatMessage({ id: 'selfManagement.new' })}
                </Button>
              </AuthButton>

              <AuthButton type="custom" code="batchdel">
                <Button
                  icon={<DeleteOutlined />}
                  loading={deleteLoading}
                  onClick={() => fetchDeleteBatch()}
                  disabled={rowkeys.length === 0}
                >
                  {intl.formatMessage({ id: 'selfManagement.batchDelete' })}
                </Button>
              </AuthButton>
              <AuthButton type="custom" code="batchedit">
                <Button loading={submitLoading} onClick={() => fetchSubmitBatch()} disabled={rowkeys.length === 0}>
                  {intl.formatMessage({ id: 'selfManagement.batchSubmitAudit' })}
                </Button>
              </AuthButton>
            </Space>
          </Col>
        </Row>
      }
    />
  )
}
export default ReadySubmitExamine
