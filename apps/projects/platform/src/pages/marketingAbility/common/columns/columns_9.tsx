import React from 'react'
import { Tooltip, Typography } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { formatTimeString } from '@/utils'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const levelList = {
  1: `${intl.formatMessage({ id: 'marketingAbility.theFirstPrize' })}`,
  2: `${intl.formatMessage({ id: 'marketingAbility.theSecondPrize' })}`,
  3: `${intl.formatMessage({ id: 'marketingAbility.theSecondPrize' })}`,
  4: `${intl.formatMessage({ id: 'marketingAbility.zhongWanxie' })}`,
  5: `${intl.formatMessage({ id: 'marketingAbility.five' })}`,
  6: `${intl.formatMessage({ id: 'marketingAbility.six' })}`,
}

const typeList = {
  1: `${intl.formatMessage({ id: 'marketingAbility.goods' })}`,
  2: `${intl.formatMessage({ id: 'marketingAbility.coupons' })}`,
  3: `${intl.formatMessage({ id: 'marketingAbility.cash' })}`,
  4: `${intl.formatMessage({ id: 'marketingAbility.integral' })}`,
  5: `${intl.formatMessage({ id: 'marketingAbility.thankYouForYourParticipation' })}`,
}

const columns_9 = () => {
  return [
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.levelOfAward' })}`,
      key: 'level',
      dataIndex: 'level',
      width: 240,
      render: (_text) => <Typography.Text>{levelList[_text]}</Typography.Text>,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.awardCategories' })}`,
      key: 'type',
      dataIndex: 'type',
      width: 240,
      render: (_text) => <Typography.Text>{typeList[_text]}</Typography.Text>,
    },
    {
      title: (
        <Tooltip
          placement="top"
          title={intl.formatMessage({
            id: 'marketingAbility.winningProbabilityCurrentWinningSettingChanceWinningProbability',
          })}
        >
          {intl.formatMessage({ id: 'marketingAbility.theOdds' })}
          <QuestionCircleOutlined />
        </Tooltip>
      ),
      key: 'probability',
      dataIndex: 'probability',
      width: 176,
      render: (_text) => <Typography.Text>{_text}&nbsp;%</Typography.Text>,
    },
    {
      title: `${intl.formatMessage({ id: 'marketingAbility.thePrize' })}`,
      key: 'prize',
      dataIndex: 'prize',
      render: (_text, record) => (
        <>
          {record.type === 3 ? (
            <Typography.Text>
              {Number(_text).toFixed(2)}&nbsp;{intl.formatMessage({ id: 'marketingAbility.yuan' })}
            </Typography.Text>
          ) : record.type === 4 ? (
            <Typography.Text>
              {_text}&nbsp;{intl.formatMessage({ id: 'marketingAbility.jifen' })}
            </Typography.Text>
          ) : record.type === 5 ? (
            `${intl.formatMessage({ id: 'marketingAbility.thereIsNo' })}`
          ) : record.type === 1 ? (
            !isEmpty(record.coupon) && (
              <Typography.Text>
                {record.coupon.id}/{record.coupon.typeName}/{intl.formatMessage({ id: 'marketingAbility.youxiaoqi' })}
                {formatTimeString(record.coupon.effectiveTimeStart)}
                {intl.formatMessage({ id: 'marketingAbility.zhi' })}
                {formatTimeString(record.coupon.effectiveTimeEnd)}/
                {intl.formatMessage({ id: 'marketingAbility.shiyongshangpin' })}
                {record.coupon.suitableProduct?.productId}/{record.coupon.suitableProduct?.productName}
              </Typography.Text>
            )
          ) : (
            !isEmpty(record.coupon) && (
              <Typography.Text>
                {record.coupon.id}/{record.coupon.typeName}/{intl.formatMessage({ id: 'common.money' })}
                {Number(record.coupon.useConditionMoney).toFixed(2)}/
                {intl.formatMessage({ id: 'marketingAbility.youxiaoqi' })}
                {formatTimeString(record.coupon.effectiveTimeStart)}
                {intl.formatMessage({ id: 'marketingAbility.zhi' })}
                {formatTimeString(record.coupon.effectiveTimeEnd)}
              </Typography.Text>
            )
          )}
        </>
      ),
    },
  ]
}
export default columns_9
