import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View } from '@apps/mobile-ui'
import { useRouter, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { isJSONStr } from '@/utils'
import { themeLayout } from '@/constants/theme'
import {
  getAftersalesMobileRepairGoodsGetDetailByConsumer,
  GetAftersalesMobileRepairGoodsGetDetailByConsumerResponse,
  getAftersalesMobileRepairGoodsPageRepairGoods,
  GetAftersalesMobileRepairGoodsPageRepairGoodsResponseDetail,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Grid from '@/components/Grid'
import Evaluation from '../../components/Evaluation'
import AsProductListCard from '../../components/AsProductListCard'
import AsPageHeader from '../../components/AsPageHeader'
import AsInfoPopup from '../../components/AsInfoPopup'
import RepairAddress from '../components/RepairAddress'
import styles from './index.module.scss'
type RouteParams = {
  /**
   * 数据id
   */
  repairId: string
}
export interface DetailsData extends GetAftersalesMobileRepairGoodsGetDetailByConsumerResponse {}
const RepairDetails: React.FC = () => {
  const router = useRouter<RouteParams>()
  const { params } = router
  const [details, setDetails] = useState<DetailsData>()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<GetAftersalesMobileRepairGoodsPageRepairGoodsResponseDetail[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [visibleAsInfoPopup, setVisibleAsInfoPopup] = useState(false)
  const intl = useIntl()
  const getDetails = () => {
    if (!params.repairId || loading) {
      return
    }
    setLoading(true)
    getAftersalesMobileRepairGoodsGetDetailByConsumer({
      repairId: `${params.repairId}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setDetails(res.data)
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }
  const getProducts = () => {
    if (!params.repairId || productsLoading) {
      return
    }
    setProductsLoading(true)
    getAftersalesMobileRepairGoodsPageRepairGoods({
      repairId: `${params.repairId}`,
      current: `${1}`,
      pageSize: `${99999}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setProducts(res.data.data)
        }
      })
      .catch(() => {})
      .finally(() => {
        setProductsLoading(false)
      })
  }
  useEffect(() => {
    getDetails()
    getProducts()
  }, [])

  // 跳转相关凭证
  const handleJumpVoucherList = () => {
    const list = details?.faultFileList.map((item) => item.filePath)
    preload({
      dataSource: list || [],
    })
    Router.navigateTo('afterService/afterRecords/voucherList')
  }
  const handleVisibleAsInfoPopup = (flag?: boolean) => {
    setVisibleAsInfoPopup(!!flag)
  }
  return (
    <View className={styles['repair-details']}>
      <AsPageHeader title={details?.outerStatusName || ''}>
        {/* 维修商品 */}
        <AsProductListCard
          afterType={1}
          dataSource={products.map((item) => ({
            productName: item.productName,
            unit: item.unit,
            skuPic: item.skuPic,
            applyCount: item.repairCount,
            purchasePrice: item.purchasePrice,
            skuId: 0,
            remaining: 0,
          }))}
          orderType={details?.orderType!}
        />
        {/* 维修原因 */}
        <MellowCard
          bodyStyle={{
            padding: 0,
          }}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'repairRecords.repairDetails.repaireReason',
                defaultMessage: '维修原因',
              })}
              value={details?.repaireReason}
            />
          </Cell>
        </MellowCard>
        {/* 维修地址 */}
        <RepairAddress
          customStyle={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          address={details?.repairAddress ? isJSONStr(details?.repairAddress) : {}}
        />
        {/* 售后评价 */}
        {details && details.evaluate ? (
          <Evaluation
            customStyle={{
              marginTop: pxTransform(themeLayout['margin-xs']),
            }}
            level={details.evaluate.level}
            content={details.evaluate.content}
          />
        ) : null}
        {/* 操作入口 */}
        <MellowCard
          bodyStyle={{
            padding: 0,
          }}
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
        >
          <Grid column={4} border={false}>
            <Grid.Item
              icon="RepairApplication"
              title={intl.formatMessage({
                id: 'repairRecords.repairDetails.asInfo',
                defaultMessage: '维修申请信息',
              })}
              onClick={() => handleVisibleAsInfoPopup(true)}
            />
            {details && details.faultFileList?.length > 0 ? (
              <Grid.Item
                icon="Certificate"
                title={intl.formatMessage({
                  id: 'repairRecords.repairDetails.faultFileList',
                  defaultMessage: '相关凭证',
                })}
                onClick={handleJumpVoucherList}
              />
            ) : null}
          </Grid>
        </MellowCard>
      </AsPageHeader>
      {/* 维修申请信息 */}
      <AsInfoPopup
        afterType={1}
        data={{
          applyNo: details?.applyNo,
          supplierName: details?.shopName,
          applyTime: details?.applyTime,
        }}
        visible={visibleAsInfoPopup}
        onClose={() => handleVisibleAsInfoPopup(false)}
      />
    </View>
  )
}
export default GlobalWrapper(RepairDetails)
