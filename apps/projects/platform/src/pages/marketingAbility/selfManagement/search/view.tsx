import { useIntl } from '@linkseeks/i18n'
import React, { Fragment, useRef, useState } from 'react'
import { Badge, Button, DatePicker, Tag } from 'antd'
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
import DateModalLayout from '../../components/dateModal'
import { InnerStatusColor, OuterStatusColor } from '../../common/tagColor'
import {
  getMarketingMerchantActivityGetActivityTypeList,
  getMarketingMerchantActivityGetInnerStatusList,
  getMarketingMerchantActivityGetOuterStatusList,
  getMarketingMerchantActivityPage,
  postMarketingMerchantActivityRestart,
  postMarketingMerchantActivityStop,
} from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
const { onFormMount$ } = FormEffectHooks
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

type dateInfoProps = {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 接口 */
  fieldApi: any
}

const Search = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [dateInfo, setDateInfo] = useState<dateInfoProps>()
  const [dateVisible, setDateVisible] = useState<boolean>(false)

  const Api = (operate) => {
    switch (operate) {
      case 'stop':
        return postMarketingMerchantActivityStop
      case 'start':
        return postMarketingMerchantActivityRestart
    }
  }

  const handleOperate = (record, operate) => {
    setDateInfo({
      id: record.id,
      title:
        operate === 'stop'
          ? `${intl.formatMessage({ id: 'selfManagement.terminationOf' })}`
          : `${intl.formatMessage({ id: 'selfManagement.startThe' })}`,
      fieldApi: Api(operate),
    })
    setDateVisible(true)
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
            url={`/marketingAbility/selfManagement/search/detail?id=${record.id}&preview=1`}
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
      render: (_text, record) => (
        <Fragment>
          {record.update && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() => history.push(`/marketingAbility/selfManagement/readySubmitExamine/edit?id=${record.id}`)}
              >
                {intl.formatMessage({ id: 'selfManagement.modifyThe' })}
              </Button>
            </AuthButton>
          )}
          {record.stop && (
            <AuthButton type="custom" code="stop">
              <Button type="link" onClick={() => handleOperate(record, 'stop')}>
                {intl.formatMessage({ id: 'selfManagement.terminationOf' })}
              </Button>
            </AuthButton>
          )}
          {record.restart && (
            <AuthButton type="custom" code="restart">
              <Button type="link" onClick={() => handleOperate(record, 'start')}>
                {intl.formatMessage({ id: 'selfManagement.restartThe' })}
              </Button>
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
      /** 内部状态 */
      getMarketingMerchantActivityGetInnerStatusList()
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.status }
          })
          linkage.enum('innerStatus', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
    })
  }

  const handleOnSubmit = () => {
    setDateVisible(false)
    ref.current.reloadCurrent()
  }

  return (
    <Fragment>
      <TableLayout
        reload={ref}
        columns={columns}
        effects="activityName"
        fetch={getMarketingMerchantActivityPage}
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
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  //改变间隔
                  marginRight: 0,
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
                    innerStatus: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: `${intl.formatMessage({ id: 'selfManagement.internalState' })}`,
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
      />
      <DateModalLayout
        id={dateInfo?.id}
        title={dateInfo?.title}
        visible={dateVisible}
        fieldApi={dateInfo?.fieldApi}
        onCancel={() => setDateVisible(false)}
        onSubmit={handleOnSubmit}
      />
    </Fragment>
  )
}
export default Search
