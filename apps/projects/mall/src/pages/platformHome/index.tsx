import React, { useEffect, useMemo, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'
import { HomeLayoutLoaderReturn } from '@/loaders/homeLayoutLoader'
import Category from '@/components/Category'
import {
  getCommodityWebCategoryWebFindPlatformCategoryTree,
  getManageAreaFindProvinceCity,
  GetManageAreaFindProvinceCityResponse,
  getManageMobileAreaFindByPCode,
  GetManageMobileAreaFindByPCodeResponse,
  getProductPlatformGetCategoryTree,
  GetProductPlatformGetCategoryTreeResponse,
} from '@apps/apis'
import { CategoryItemType } from '@/types/commodity'
import { SelectAreaItemType } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import Header from './components/Header'
import MainNav from './components/MainNav'
import Advert from './components/Advert'
import QuickNav from './components/QuickNav'
import CommodityList from './components/CommodityList'
import BrandList from './components/BrandList'
import NiceBusiness from './components/NiceBusiness'
import Information from './components/Information'
import Process from './components/Process'
import Purchase from './components/Purchase'
import Logistics from './components/Logistics'
import Service from './components/Service'
import styles from './index.module.less'

export interface TemplateListItemType {
  name: string
  status: boolean
  content: any
}

interface AnchorItemType {
  id: string
  name: string
}

const PlatformHome: React.FC = () => {
  const { mallInfo, userInfo, mallUrl, currentCity, designConfig } = useGlobalConext()
  const { seoInfo } = useLoaderData() as HomeLayoutLoaderReturn
  const [categoryList, setCategoryList] = useState<GetProductPlatformGetCategoryTreeResponse>([])
  const [categoryTreeList, setCategoryTreeList] = useState<CategoryItemType[]>([])
  const [anchorList, setAnchorList] = useState<AnchorItemType[]>([])
  const [areaData, setAreaData] = useState<SelectAreaItemType[]>([])
  const translate = getWebIntl()

  const fetchCategoryTree = () => {
    getProductPlatformGetCategoryTree().then((res: any) => {
      setCategoryList(res.data)
    })
  }

  const getLetterByList = (code: string, provinceList: GetManageMobileAreaFindByPCodeResponse): string | undefined => {
    const filterItem = provinceList.filter((item) => item.code === code)[0]
    return filterItem?.firstName
  }

  const initArea = (
    areaData: GetManageAreaFindProvinceCityResponse,
    provinceList: GetManageMobileAreaFindByPCodeResponse,
  ): SelectAreaItemType[] => {
    return areaData.map((item) => {
      return {
        ...item,
        letter: getLetterByList(item.provinceCode, provinceList),
      } as unknown as SelectAreaItemType
    })
  }

  const fetchAreaData = async () => {
    const codeRes = await getManageMobileAreaFindByPCode()
    if (codeRes.code === 1000 && codeRes.data && codeRes.data.length > 0) {
      getManageAreaFindProvinceCity({}, { useCache: true }).then((res: any) => {
        if (res.data) {
          setAreaData(initArea(res.data, codeRes.data))
        }
      })
    }
  }

  useEffect(() => {
    fetchAreaData()
    fetchCategoryTree()
    getCategoryTree()
  }, [])

  const getConfigByName = (name: string, result?: any) => {
    const configList = designConfig || []
    let configInfo: TemplateListItemType | undefined = undefined
    for (let i = 0; i < configList.length; i++) {
      const configItem = configList[i]
      if (configItem.name === name) {
        configInfo = configItem
        break
      }
    }
    if (configInfo) {
      return configInfo.content
    } else {
      return result
    }
  }

  const initCategoryData = (list: any, parentKey?: string, parentName?: string) => {
    if (!list) {
      return []
    }
    const result: any = list.map((item: any) => {
      let cid = `c${item.id}`
      let treeName = item.title
      if (parentKey) {
        cid = `${parentKey}_${cid}`
        treeName = `${parentName} ${treeName}`
      }

      const newItem: CategoryItemType = {
        title: item.name,
        name: item.name,
        treeName: treeName,
        key: cid,
        id: item.id,
        categoryId: item.id,
        brandList: item.brandList,
      }
      if (item.children && item.children.length > 0) {
        newItem.children = initCategoryData(item.children, cid, treeName)
      }
      return newItem
    })
    return result
  }

  /**
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    const param: any = {}
    const headers: any = {
      shopId: mallUrl?.defaultEnterprise?.id,
    }
    getCommodityWebCategoryWebFindPlatformCategoryTree(param, { headers }).then((res) => {
      if (res.code === 1000) {
        setCategoryTreeList(initCategoryData(res.data))
      }
    })
  }

  const renderFlowConfigComponent = () => {
    const flowItemNameList = [
      'goods',
      'brand',
      'merchant',
      'marketInformation',
      'middleAdvert',
      'purchase',
      'logistics',
      'process',
      'platform',
      'bottomAdvert',
    ]
    const configList =
      designConfig && designConfig.length > 0 ? designConfig.sort((a) => (a.name === 'goods' ? -1 : 1)) : []

    const components: any[] = []
    const tempAnchorList: AnchorItemType[] = []
    configList.forEach((item, index) => {
      if (flowItemNameList.includes(item.name)) {
        switch (item.name) {
          // 商品推荐
          case 'goods':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.xianhuotuijian'),
              })
              components.push(
                <CommodityList
                  key={`CommodityList_${item.name}_${index}`}
                  currentCity={currentCity}
                  anchor={item.name}
                  templateId={mallInfo?.adornId}
                  content={item.content || []}
                />,
              )
            }
            break
          // 品牌馆
          case 'brand':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.pinpaiguan'),
              })
              components.push(
                <BrandList key={`BrandList${item.name}_${index}`} anchor={item.name} dataList={item.content || []} />,
              )
            }
            break
          // 实力商家
          case 'merchant':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.shilishangjia'),
              })
              components.push(
                <NiceBusiness
                  key={`NiceBusiness${item.name}_${index}`}
                  currentCity={currentCity}
                  templateId={mallInfo?.adornId}
                  anchor={item.name}
                  dataList={item.content || []}
                />,
              )
            }
            break
          // 行情资讯
          case 'marketInformation':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.nav-info'),
              })
              components.push(
                <Information
                  key={`Information${item.name}_${index}`}
                  anchor={item.name}
                  marketList={item.content.marketList || []}
                  information={item.content.information || {}}
                />,
              )
            }
            break
          case 'middleAdvert':
            if (item.status) {
              components.push(
                <Advert
                  key={`Advert${item.name}_${index}`}
                  type="floorBanner"
                  advertList={getConfigByName('middleAdvert', [])}
                />,
              )
            }
            break
          // 名企采购
          case 'purchase':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.mingqicaigou'),
              })
              components.push(
                <Purchase
                  key={`Purchase${item.name}_${index}`}
                  currentCity={currentCity}
                  anchor={item.name}
                  advertList={item.content && Array.isArray(item.content) ? item.content : [item.content]}
                />,
              )
            }
            break
          // 物流服务
          case 'logistics':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.wuliufuwu'),
              })
              components.push(
                <Logistics
                  key={`Logistics${item.name}_${index}`}
                  currentCity={currentCity}
                  templateId={mallInfo?.adornId}
                  areaData={areaData}
                  categoryList={categoryList}
                  anchor={item.name}
                  dataInfo={item.content || {}}
                />,
              )
            }
            break
          // 加工服务
          case 'process':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.jiagongfuwu'),
              })
              components.push(
                <Process
                  key={`Process${item.name}_${index}`}
                  currentCity={currentCity}
                  templateId={mallInfo?.adornId}
                  areaData={areaData}
                  categoryList={categoryList}
                  anchor={item.name}
                  dataInfo={item.content || {}}
                />,
              )
            }
            break
          // 平台服务
          case 'platform':
            if (item.status) {
              tempAnchorList.push({
                id: item.name,
                name: translate('web.resource.mall.pingtaifuwu'),
              })
              components.push(
                <Service key={`Service${item.name}_${index}`} anchor={item.name} dataList={item.content || []} />,
              )
            }
            break
          case 'bottomAdvert':
            if (item.status) {
              components.push(
                <Advert
                  key={`ServiceAdvert${item.name}_${index}`}
                  type="service"
                  advertList={getConfigByName('bottomAdvert', [])}
                />,
              )
            }
            break
          default:
            break
        }
      }
    })
    if (tempAnchorList.length > 0) {
      setAnchorList(tempAnchorList)
    }
    return components
  }

  return (
    <HelmetProvider
      title={seoInfo?.title || mallInfo?.name || ''}
      keyword={seoInfo?.keywords || mallInfo?.name || ''}
      description={seoInfo?.description || mallInfo?.name || ''}
    >
      <div className={styles.container}>
        <Header />
        <MainNav />
        <div className={styles.bannerWrap}>
          <Category categoryList={categoryTreeList} />
          <div className={styles.bannerContainer}>
            <div className={styles.bannerHorizontal}>
              <Advert type="banner" advertList={getConfigByName('bannerAdvert', [])} />
              <Advert type="bannerRight" advertList={getConfigByName('bannerRightAdvert', [])} />
            </div>
            <div>
              <Advert type="bannerBottom" advertList={getConfigByName('banneBottomrAdvert', [])} />
            </div>
          </div>
          <QuickNav name="" dataInfo={getConfigByName('fastVisit', {})} />
        </div>
        {useMemo(() => designConfig && renderFlowConfigComponent(), [designConfig, areaData, mallInfo])}
        <div style={{ height: 48 }} />
      </div>
    </HelmetProvider>
  )
}

export default PlatformHome
