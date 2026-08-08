import React, { useEffect, useState } from 'react'
import { getWebIntl } from '@/utils/locales'
import { Button, Table } from 'antd'
import { LinkTo, integrationTime } from '@/utils'
import askPurchase from '@/assets/imgs/askPurchase.png'
import time from '@/assets/imgs/time.png'
import buy from '@/assets/imgs/buy.png'
import file from '@/assets/imgs/file.png'
import useCountdown from '@/hooks/useCountdown'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface Props {
  data?: any
}

const OfferCard: React.FC<Props> = (props) => {
  const {
    name = '-',
    askPurchaseGoodsResponses = [],
    deliverAddress = '',
    deliverTime = '',
    billTime = '',
    quoteEndTime = '',
    quoteCount = '',
    id = '-',
    status,
  } = props.data
  const { count, setTime } = useCountdown()
  const translate = getWebIntl()
  const [isMore, setIsMore] = useState<boolean>(false)
  const { linkPrefix } = useLink()

  useEffect(() => {
    if (quoteEndTime && status !== 3) {
      setTime(new Date(quoteEndTime).getTime())
    }
  }, [quoteEndTime, status])

  const columns = [
    {
      title: translate('web.resource.commodity.wuliaobianhao'),
      dataIndex: 'goodsNo',
      key: 'goodsNo',
    },
    {
      title: translate('web.resource.commodity.wuliaomingcheng'),
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
    {
      title: translate('web.resource.commodity.guigexinghao'),
      dataIndex: 'specification',
      key: 'specification',
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: translate('web.resource.mall.brand'),
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: translate('web.resource.mall.qiugoushuliang'),
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: translate('web.resource.member.fujian'),
      dataIndex: 'enclosureUrls',
      key: 'enclosureUrls',
      render: (newSelect: any, key: any) => {
        return newSelect?.map((item: any) => {
          return (
            <div className="ellipsis-warp">
              <a target="_blank" key={item.id} download href={item.url}>
                {item.name}
              </a>
            </div>
          )
        })
      },
    },
  ]

  return (
    <>
      <div className={styles['offer-main']}>
        <div className={styles['offer-main-left']}>
          <div className={styles['title']}>
            <img src={askPurchase} className={styles['img']} />
            {name}
          </div>
          <div className={styles['content']}>
            <li className={styles['card-item']}>
              <span className={styles['card-key']}>{translate('web.resource.mall.jiaofudizhi')}：</span>
              <span className={styles['card-value']}>{deliverAddress}</span>
            </li>

            <li className={styles['card-item']}>
              <span className={styles['card-key']}>{translate('web.resource.mall.jiaofuriqi')}：</span>
              <span className={styles['card-value']}>{integrationTime(deliverTime, 'YMD')}</span>
            </li>

            <li className={styles['card-item']}>
              <span className={styles['card-key']}>{translate('web.resource.mall.fabushijian')}：</span>
              <span className={styles['card-value']}>{integrationTime(billTime, 'YMD')}</span>
            </li>
          </div>
        </div>
        <div className={styles['offer-main-right']}>
          <div className={styles['offer-main-content']}>
            <li className={styles['card-item']}>
              <img className={styles['card-img']} src={time} style={{ width: 12, height: 14 }} />
              <span className={styles['card-key']}>{translate('web.resource.mall.baojiashengyu')}：</span>
              {(count?.d && count?.d > 0) ||
              (count?.h && count?.h > 0) ||
              (count?.m && count?.m > 0 && status !== 3) ? (
                <>
                  {count?.d ? (
                    <>
                      <span className={styles['card-value']}>{count?.d}</span>
                      {translate('web.common.tian')}
                    </>
                  ) : null}
                  {count?.h ? (
                    <>
                      <span className={styles['card-value']}>{count?.h}</span> {translate('web.common.hour')}
                    </>
                  ) : null}
                  {count?.m ? (
                    <>
                      <span className={styles['card-value']}>{count?.m}</span> {translate('web.resource.mall.fen')}
                    </>
                  ) : null}
                </>
              ) : (
                <span className={styles['card-value']}>{translate('web.resource.mall.baojiayijiezhi')}</span>
              )}
            </li>

            <li className={styles['card-item']}>
              <img className={styles['card-img']} src={buy} style={{ width: 16, height: 16 }} />
              <span className={styles['card-key']}>{translate('web.resource.mall.caigoushangpin')}：</span>
              <span className={styles['card-value']}>{askPurchaseGoodsResponses?.length || 0}</span>
              {translate('web.common.zhong')}
            </li>

            <li className={styles['card-item']}>
              <img className={styles['card-img']} src={file} style={{ width: 13, height: 13 }} />
              <span className={styles['card-key']}>{translate('web.resource.mall.baojiafenshu')}：</span>
              <span className={styles['card-value']}>{quoteCount}</span>
              {translate('web.common.fen')}
            </li>
          </div>
          <div className={styles['offer-main-btn']}>
            <Button
              type="default"
              className={styles['btn']}
              onClick={() => LinkTo(linkPrefix(`/askPurchaseDetail/${id}`))}
            >
              {translate('web.resource.mall.chakanxiangqing')}
            </Button>
          </div>
        </div>
      </div>

      {askPurchaseGoodsResponses?.length > 0 && (
        <>
          <div className={styles['offer-table']}>
            <Table
              pagination={false}
              dataSource={isMore ? askPurchaseGoodsResponses : askPurchaseGoodsResponses.slice(0, 3)}
              columns={columns}
            />
          </div>
          {askPurchaseGoodsResponses?.length > 3 &&
            (isMore ? (
              <div className={styles['more-title']} onClick={() => setIsMore(false)}>
                {translate('web.resource.mall.shouqi')}
              </div>
            ) : (
              <div className={styles['more-title']} onClick={() => setIsMore(true)}>
                {translate('web.resource.mall.dianjijiazaigengduo')}({askPurchaseGoodsResponses?.length - 3})
              </div>
            ))}
        </>
      )}
    </>
  )
}

export default OfferCard
