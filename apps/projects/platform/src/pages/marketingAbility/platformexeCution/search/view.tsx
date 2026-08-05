import React from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Tag, Typography } from 'antd'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import {
  getMarketingAbilityActivityExecutePlatformPage,
  getMarketingPlatformActivitySignupGetActivityTypeList,
  getMarketingPlatformActivitySignupGetOuterStatusList,
} from '@apps/apis'
import TableLayout from '@/components/TableLayout'
import { OuterStatusColor } from '../../common/tagColor'
import { PATTERN_MAPS } from '@/constants/regExp'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FormEffectHooks } from '@apps/formily'
const { onFormMount$ } = FormEffectHooks

const Search = () => {
  const intl = useIntl()
  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (text, record) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() =>
            history.push(`/marketingAbility/paltformSign/search/detail?activityId=${text}&signUpId=${record.signupId}`)
          }
        >
          {text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.huodongmingcheng' }),
      dataIndex: 'activityName',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.huodongleixing' }),
      dataIndex: 'activityTypeName',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.huodongkaishishijian' }),
      dataIndex: 'startTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.huodongjieshushijian' }),
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.baomingshijian' }),
      dataIndex: 'signupTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.canyukehushu' }),
      dataIndex: 'customerCount',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.yizhixingdingdanshu' }),
      dataIndex: 'orderCount',
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.orderAmount' }),
      dataIndex: 'orderAmount',
      render: (text) => (
        <Typography.Text>
          {intl.formatMessage({ id: 'common.money' })}
          {Number(text).toFixed(2)}
        </Typography.Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.waibuzhuangtai' }),
      dataIndex: 'statusName',
      render: (text, _) => <Tag color={OuterStatusColor(_.status)}>{text}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.operation' }),
      dataIndex: 'opertion',
      render: (_text, _) => (
        <Button
          type="link"
          onClick={() => history.push(`/marketingAbility/platformexeCution/search/detail?id=${_.id}`)}
        >
          {intl.formatMessage({ id: 'balance.accountsReceivable.invoice.columns.operation.1' })}
        </Button>
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
      /** 外部状态 */
      getMarketingPlatformActivitySignupGetOuterStatusList()
        .then((res) => {
          const _enum = res.data.map((item) => {
            return { label: item.name, value: item.status }
          })
          linkage.enum('outerStatus', _enum)
        })
        .catch((err) => {
          console.warn(err)
        })
    })
  }

  return (
    <TableLayout
      columns={columns}
      effects="activityName"
      fetch={getMarketingAbilityActivityExecutePlatformPage}
      useStateEffects={useStateEffects}
      schema={{
        type: 'object',
        properties: {
          mageLayout: {
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
            'x-component': 'Flex-Layout',
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
                  allowClear: true,
                  style: {
                    width: 240,
                  },
                },
              },
              activityType: {
                type: 'string',
                default: undefined,
                enum: [],
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'marketingAbility.huodongleixing' })}`,
                  allowClear: true,
                  style: {
                    width: 160,
                  },
                },
              },
              outerStatus: {
                type: 'string',
                default: undefined,
                enum: [],
                'x-component-props': {
                  placeholder: `${intl.formatMessage({ id: 'marketingAbility.waibuzhuangtai' })}`,
                  allowClear: true,
                  style: {
                    width: 160,
                  },
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: `${intl.formatMessage({ id: 'marketingAbility.chaxun' })}`,
                },
              },
            },
          },
        },
      }}
    />
  )
}
export default Search
