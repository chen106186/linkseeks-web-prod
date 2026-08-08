import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, IndexList } from '@apps/mobile-ui'
import { IndexListItem, IndexItem } from '@apps/mobile-ui/packages/types/index-list'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { COLOR, PRIMARY } from '@/constants/theme'
import { getLogisticsMobileCompanyList, GetLogisticsMobileCompanyListResponse } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import Cell from '@/components/Cell'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import styles from './index.module.scss'
export type KeyType = string
interface RouteParams {
  /**
   * 选择后的回调
   */
  onCallback: (value: IndexItem) => void
  /**
   * 默认选择的物流公司
   */
  defaultValue: string
}
const ChooseLogisticsCompany: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const [list, setList] = useState<IndexListItem[]>([])
  const { OTHER_LOGISTICS_COMPANY_KEY } = useAfterServiceConst()
  const intl = useIntl()
  const normalizeLogisticsCompanyList = (dataSource: GetLogisticsMobileCompanyListResponse) => {
    let ret: IndexListItem[] = []
    dataSource.forEach((item) => {
      let current = ret.find((existing) => existing.key === item.sort)
      if (!current) {
        current = {
          key: item.sort,
          title: `# ${item.sort}`,
          items: [],
        }
        ret.push(current)
      }
      current.items.push({
        name: item.name,
      })
    })
    // 插入其他项
    const other = {
      key: '--',
      title: `# ${intl.formatMessage({
        id: 'afterRecords.chooseLogisticsCompany.other',
        defaultMessage: '其他',
      })}`,
      items: [
        {
          name: intl.formatMessage({
            id: 'afterRecords.chooseLogisticsCompany.other',
            defaultMessage: '其他',
          }),
          key: OTHER_LOGISTICS_COMPANY_KEY,
        },
      ],
    }
    ret = ret.filter((item) => item.key)
    ret.sort((a, b) => (a.key as string).charCodeAt(0) - (b.key as string).charCodeAt(0)).push(other)
    return ret
  }
  const getLogisticsCompanyList = () => {
    getLogisticsMobileCompanyList()
      .then((res) => {
        if (res.code === 1000) {
          const normal = normalizeLogisticsCompanyList(res.data)
          setList(normal)
          // if (params?.defaultValue) {
          //   const defaultItem = normal.find((item) => item.items.find((grand) => grand.name === params?.defaultValue));
          //   if (defaultItem) {
          //     setActive(defaultItem.key);
          //   }
          // }
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }
  useEffect(() => {
    getLogisticsCompanyList()
  }, [])
  const handleChooseCompany = (next: IndexItem) => {
    params?.onCallback?.(next)
    Router.navigateBack()
  }
  return (
    <View className={styles['logistics-company']}>
      <PageLayout
        renderHeader={
          <NavBar
            title={intl.formatMessage({
              id: 'afterRecords.chooseLogisticsCompany.nav',
              defaultMessage: '选择物流公司',
            })}
          />
        }
      >
        <IndexList
          list={list}
          topKey=" "
          isVibrate={false}
          isShowToast={false}
          renderItem={(item) => (
            <Cell>
              <Cell.Item
                key={item.name}
                title={
                  <View className={styles['logistics-company-item-titleWrap']}>
                    <Text className={styles['logistics-company-item-title']}>{item.name}</Text>
                    {item.name === params?.defaultValue ? (
                      <View className={styles['logistics-company-item-icon']}>
                        <Icons name="Right" size={14} color={COLOR[PRIMARY]} />
                      </View>
                    ) : null}
                  </View>
                }
                onPress={() => handleChooseCompany(item)}
                clickable
              />
            </Cell>
          )}
        />
      </PageLayout>
    </View>
  )
}
export default GlobalWrapper(ChooseLogisticsCompany)
