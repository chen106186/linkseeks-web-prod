import React, { useEffect, useState, useMemo } from 'react'
import { View, Text } from '@apps/mobile-ui'
import Skeleton from '@/components/Skeleton'
import ImageBox from '@/components/ImageBox'
import { useIntl } from '@linkseeks/i18n'
import { getProductCommodityTemplateGetBrandList } from '@apps/apis'
import Router from '@/utils/router'
import { THEME_COLORS } from '@/constants/theme'
import styles from './index.module.scss'

interface BrandItemType {
  id: number
  name: string
  logoUrl: string
}

interface BrandProps {
  shopId: number | undefined
  status?: boolean
  details: {
    title?: string
    explain?: string
    ids: number[]
  }
}

const Brand: React.FC<BrandProps> = (props) => {
  const intl = useIntl()
  const { shopId, status, details } = props
  const [loading, setLoading] = useState<boolean>(true)
  const [brandList, setBrandList] = useState<BrandItemType[]>([])
  const {
    title = intl.formatMessage({ id: 'mall_own_brand_title' }),
    explain = intl.formatMessage({ id: 'mall_own_brand_explain' }),
  } = details?.[0] || {}
  const { brandIds } = details?.[1] || {}

  const fetchBrandListByIds = () => {
    const params: any = {
      current: 1,
      pageSize: 6,
      shopId: shopId,
      idInList: brandIds.join(','),
    }

    getProductCommodityTemplateGetBrandList(params)
      .then((res) => {
        setLoading(false)
        if (res.code === 1000 && res.data.data) {
          const result = res.data.data
          setBrandList(result)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (brandIds && Array.isArray(brandIds) && brandIds.length > 0) {
      fetchBrandListByIds()
    } else {
      setLoading(false)
    }
  }, [brandIds])

  if (!status) return null

  const handleLink = (info: BrandItemType) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', {
      brandId: info.id,
      brandName: info.name,
    })
  }

  const _renderBrandList = useMemo(() => {
    if (brandList && brandList.length > 0) {
      return brandList.map((brandItem) => (
        <View key={brandItem.id} className={styles['brand-list-item']} onClick={() => handleLink(brandItem)}>
          <ImageBox width={96} height={34} style={{ height: 34 }} borderRadius={0} source={brandItem.logoUrl} />
        </View>
      ))
    }
    return null
  }, [brandList])

  return !loading ? (
    <View className={styles['brand']}>
      <View className={styles['brand-header']}>
        <View className={styles['brand-header-wrap']}>
          <Text className={styles['title']}>{title}</Text>
          <Text className={styles['explain']}>{explain}</Text>
        </View>
      </View>
      <View className={styles['brand-list']}>{_renderBrandList}</View>
    </View>
  ) : (
    <View style={{ backgroundColor: THEME_COLORS.surface, margin: '8px', borderRadius: '8px' }}>
      <Skeleton.List column={3} row={2} item={<Skeleton height={40} style={{ margin: '6px' }} />} />
    </View>
  )
}

Brand.defaultProps = {
  status: true,
}

export default Brand
