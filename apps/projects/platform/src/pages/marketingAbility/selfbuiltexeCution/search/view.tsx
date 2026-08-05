import React from 'react'
import { Badge, Button, Typography } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import {
  getMarketingAbilityActivityExecuteMerchantPage,
  getMarketingMerchantActivityGetActivityTypeList,
  getMarketingMerchantActivityGetInnerStatusList,
} from '@apps/apis'
import TableLayout from '@/components/TableLayout'
import { InnerStatusColor } from '../../common/tagColor'
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
      render: (text) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => history.push(`/marketingAbility/selfManagement/search/detail?id=${text}&preview=true`)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.huodongmingcheng' })}`,
      dataIndex: 'activityName',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.huodongleixing' })}`,
      dataIndex: 'activityTypeName',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.huodongkaishishijian' })}`,
      dataIndex: 'startTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.huodongjieshushijian' })}`,
      dataIndex: 'endTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.canyukehushu' })}`,
      dataIndex: 'customerCount',
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.yizhixingdingdanshu' })}`,
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
      title: intl.formatMessage({ id: 'marketingAbility.neibuzhuangtai' }),
      dataIndex: 'statusName',
      render: (text, _) => <Badge status={InnerStatusColor(_.status)} text={text} />,
    },
    {
      title: intl.formatMessage({ id: 'marketingAbility.operation' }),
      dataIndex: 'opertion',
      render: (_text, _) => (
        <Button
          type="link"
          onClick={() => history.push(`/marketingAbility/selfbuiltexeCution/search/detail?id=${_.id}`)}
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

  return (
    <TableLayout
      columns={columns}
      effects="activityName"
      fetch={getMarketingAbilityActivityExecuteMerchantPage}
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
                  placeholder: intl.formatMessage({ id: 'marketingAbility.huodongleixing' }),
                  allowClear: true,
                  style: {
                    width: 160,
                  },
                },
              },
              innerStatus: {
                type: 'string',
                default: undefined,
                enum: [],
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'marketingAbility.neibuzhuangtai' }),
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
