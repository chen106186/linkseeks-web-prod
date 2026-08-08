import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { integrationTime } from '@/utils'
import { getTradeAskPurchaseDetailForShop } from '@apps/apis'
import { useParams } from 'react-router-dom'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import ShopTitle from '../components/ShopTitle'
import styles from './index.module.less'

const AskPurchaseDetail: React.FC = () => {
  const { id } = useParams()
  const { mallInfo } = useGlobalConext()
  const [dataSource, setDataSource] = useState<any>([])
  const translate = getWebIntl()

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

  const [infoMessage, setInfoMessage] = useState<any>([])

  const fnGetSourceDetails = () => {
    const data: any = {
      id: id,
    }
    getTradeAskPurchaseDetailForShop(data).then((res) => {
      setInfoMessage(res.data)
      setDataSource(res.data?.askPurchaseGoodsResponses)
    })
  }

  useEffect(() => {
    if (id) {
      fnGetSourceDetails()
    }
  }, [])

  const statusText: any = {
    1: translate('web.resource.mall.daifabu'),
    2: translate('web.resource.mall.daibaojia'),
    3: translate('web.resource.mall.yijieshu'),
    4: translate('web.resource.mall.yizhongzhi'),
    5: translate('web.common.yizuofei'),
  }

  return (
    <HelmetProvider title={`${translate('web.resource.mall.qiugouxiangqing')}-${mallInfo?.name}`}>
      <div className={styles['inquiry-main']}>
        <ul className={styles['inquiry-warp']}>
          <li>
            <ShopTitle
              projectName={infoMessage?.name}
              projectType={translate('web.resource.mall.qiugoudan')}
              data={infoMessage}
              id={id}
            />
          </li>
          <li className={styles['demand-warp']}>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.xuqiudanhao')}：</div>
              <div className={styles['card-value']}>{infoMessage?.askPurchaseNo || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.xuqiuzhaiyao')}：</div>
              <div className={styles['card-value']}>{infoMessage?.name || '-'}</div>
            </div>

            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.member.caigoushangmingchen')}：</div>
              <div className={styles['card-value']}>{infoMessage?.memberName || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.member.danjushijian')}：</div>
              <div className={styles['card-value']}>{integrationTime(infoMessage?.billTime, 'YMDMS')}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.common.waibuzhuangtai')}：</div>
              <div className={styles['card-value']}>
                {infoMessage?.status ? statusText[Number(infoMessage.status)] : ''}
              </div>
            </div>
          </li>
          <li className={styles['materiel-warp']}>
            <div className={styles['card-title']}>{translate('web.resource.mall.caigouwuliao')}</div>
            <Table pagination={false} dataSource={dataSource} columns={columns} />
          </li>
          <li className={styles['materiel-warp']}>
            <div className={styles['card-title']}>{translate('web.resource.mall.jiaoyitiaojian')}</div>

            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.jiaofudizhi')}：</div>
              <div className={styles['card-value']}>{infoMessage?.deliverAddress || '-'}</div>
            </div>

            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.baojiajiezhishijian')}：</div>
              <div className={styles['card-value']}>{integrationTime(infoMessage?.quoteEndTime, 'YMD') || '-'}</div>
            </div>

            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.xunjialianxiren')}：</div>
              <div className={styles['card-value']}>{infoMessage?.contactName || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.lianxirendianhua')}：</div>
              <div className={styles['card-value']}>{infoMessage?.contactMobile || '-'}</div>
            </div>

            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.baojiayaoqiu')}：</div>
              <div className={styles['card-value']}>{infoMessage?.quoteRequire || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.member.fukuanfangshi')}：</div>
              <div className={styles['card-value']}>{infoMessage?.paymentWay || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.shuifeiyaoqiu')}：</div>
              <div className={styles['card-value']}>{infoMessage?.taxesRequire || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.wuliuyaoqiu')}：</div>
              <div className={styles['card-value']}>{infoMessage?.logisticsRequire || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.baozhuangyaoqiu')}：</div>
              <div className={styles['card-value']}>{infoMessage?.packageRequire || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.mall.qitayaoqiu')}：</div>
              <div className={styles['card-value']}>{infoMessage?.otherRequire || '-'}</div>
            </div>
            <div className={styles['card-item']}>
              <div className={styles['card-key']}>{translate('web.resource.member.fujian')}：</div>
              <div className={styles['card-filer']}>
                {infoMessage?.enclosureUrls &&
                  infoMessage?.enclosureUrls.map((item: any) => {
                    return (
                      <a target="_blank" download key={item.id} href={item.url}>
                        {item.name}
                      </a>
                    )
                  })}
                {(infoMessage?.enclosureUrls && infoMessage?.enclosureUrls.length == 0) ||
                  (!infoMessage?.enclosureUrls && <span>-</span>)}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </HelmetProvider>
  )
}

export default AskPurchaseDetail
