import React, { useMemo } from 'react'
import { useSelector } from '@apps/design-react'
import { addChildComponent, changeProps, deleteComponentByKey } from '@apps/design-core'
import ComponentModule from './ComponentModule'
import { Switch } from 'antd'
import styles from './index.less'
import attemptImg from '@/assets/activity/attempt.png'
import bargainImg from '@/assets/activity/bargain.png'
import buySwapImg from '@/assets/activity/buySwap.png'
import combinationImg from '@/assets/activity/combination.png'
import fullMoneyDiscountImg from '@/assets/activity/fullMoneyDiscount.png'
import fullMoneySubImg from '@/assets/activity/fullMoneySub.png'
import fullQuantityDiscountImg from '@/assets/activity/fullQuantityDiscount.png'
import fullQuantitySubImg from '@/assets/activity/fullQuantitySub.png'
import fullSwapImg from '@/assets/activity/fullSwap.png'
import giveProductImg from '@/assets/activity/giveProduct.png'
import groupPurchaseImg from '@/assets/activity/groupPurchase.png'
import morePieceImg from '@/assets/activity/morePiece.png'
import plummetImg from '@/assets/activity/plummet.png'
import preSaleImg from '@/assets/activity/preSale.png'
import secKillImg from '@/assets/activity/secKill.png'
import setMealImg from '@/assets/activity/setMeal.png'
import discountImg from '@/assets/activity/discount.png'
import specialOfferImg from '@/assets/activity/specialOffer.png'
import giveCouponImg from '@/assets/activity/giveCoupon.png'
import {
  ACTIVITY_ATTEMPT,
  ACTIVITY_BARGAIN,
  ACTIVITY_BUYSWAP,
  ACTIVITY_COMBINATION,
  ACTIVITY_DISCOUNT,
  ACTIVITY_FULLMONEYDISCOUNT,
  ACTIVITY_FULLMONEYSUB,
  ACTIVITY_FULLQUANTITYDISCOUNT,
  ACTIVITY_FULLQUANTITYSUB,
  ACTIVITY_FULLSWAP,
  ACTIVITY_GIVECOUPON,
  ACTIVITY_GIVEPRODUCT,
  ACTIVITY_GROUPPURCHASE,
  ACTIVITY_LIST,
  ACTIVITY_MOREPIECE,
  ACTIVITY_PLUMMET,
  ACTIVITY_PRESALE,
  ACTIVITY_SECKILL,
  ACTIVITY_SETMEAL,
  ACTIVITY_SPECIALOFFER,
} from '@/constants/activity'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const ACTIVITYS_MAP = {
  [ACTIVITY_SPECIALOFFER]: {
    title: translate('web.resource.marketing.tejiaocuxiao'),
    image: specialOfferImg,
  },
  [ACTIVITY_PLUMMET]: {
    title: translate('web.resource.marketing.zhijiangcuxiao'),
    image: plummetImg,
  },
  [ACTIVITY_DISCOUNT]: {
    title: translate('web.resource.marketing.zhekoucuxiao'),
    image: discountImg,
  },
  [ACTIVITY_FULLQUANTITYSUB]: {
    title: translate('web.resource.marketing.manliangjian'),
    image: fullQuantitySubImg,
  },
  [ACTIVITY_FULLQUANTITYDISCOUNT]: {
    title: translate('web.resource.marketing.manliangzhe'),
    image: fullQuantityDiscountImg,
  },
  [ACTIVITY_FULLMONEYSUB]: {
    title: translate('web.resource.marketing.manejian'),
    image: fullMoneySubImg,
  },
  [ACTIVITY_FULLMONEYDISCOUNT]: {
    title: translate('web.resource.marketing.manezhe'),
    image: fullMoneyDiscountImg,
  },
  [ACTIVITY_GIVEPRODUCT]: {
    title: translate('web.resource.marketing.zengsongshangpin'),
    image: giveProductImg,
  },
  [ACTIVITY_GIVECOUPON]: {
    title: translate('web.resource.marketing.zengsongyouhuiquan'),
    image: giveCouponImg,
  },
  [ACTIVITY_MOREPIECE]: {
    title: translate('web.resource.marketing.duojiancuxiao'),
    image: morePieceImg,
  },
  [ACTIVITY_COMBINATION]: {
    title: translate('web.resource.marketing.zuhecuxiao'),
    image: combinationImg,
  },
  [ACTIVITY_GROUPPURCHASE]: {
    title: translate('web.resource.marketing.pintuan'),
    image: groupPurchaseImg,
  },
  // [ACTIVITY_BARGAIN]: {
  //   title: translate('web.resource.marketing.kanjia'),
  //   image: bargainImg,
  // },
  [ACTIVITY_SECKILL]: {
    title: translate('web.resource.marketing.miaosha'),
    image: secKillImg,
  },
  [ACTIVITY_FULLSWAP]: {
    title: translate('web.resource.marketing.manehuangou'),
    image: fullSwapImg,
  },
  [ACTIVITY_BUYSWAP]: {
    title: translate('web.resource.marketing.maishangpinhuangou'),
    image: buySwapImg,
  },
  // [ACTIVITY_PRESALE]: {
  //   title: translate('web.resource.marketing.yushou'),
  //   image: preSaleImg,
  // },
  [ACTIVITY_SETMEAL]: {
    title: translate('web.resource.marketing.taocan'),
    image: setMealImg,
  },
  // [ACTIVITY_ATTEMPT]: {
  //   title: translate('web.resource.marketing.shiyong'),
  //   image: attemptImg,
  // },
} as const

const COMPONENT_NAME = {
  [ACTIVITY_SPECIALOFFER]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_PLUMMET]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_DISCOUNT]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_FULLQUANTITYSUB]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_FULLQUANTITYDISCOUNT]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_FULLMONEYSUB]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_FULLMONEYDISCOUNT]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_GIVEPRODUCT]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_GIVECOUPON]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_MOREPIECE]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  // combination: "Combination",
  [ACTIVITY_COMBINATION]: {
    mobile: {
      container: 'Combination',
      childContainer: 'Combination.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_GROUPPURCHASE]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_BARGAIN]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_SECKILL]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_FULLSWAP]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_BUYSWAP]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_PRESALE]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_SETMEAL]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
  [ACTIVITY_ATTEMPT]: {
    mobile: {
      container: 'CommodityList',
      childContainer: 'CommodityList.Item',
    },
    web: {
      container: 'WebCommodityContainer',
      childContainer: 'WebCommodity',
    },
  },
}

type ModuleType = {
  // title: string,
  // visible: boolean,
  // dataIndex: string,
  treeKey: string
}

type Turple<T extends readonly string[], P> = {
  [key in T[number]]: P
}

interface Iprops {
  isWeb?: boolean
}

const WebComponentModule: React.FC<Iprops> = (props: Iprops) => {
  const { pageConfig } = useSelector(['pageConfig'])
  const { isWeb = true } = props
  console.log('pageConfig', pageConfig)
  const modules = useMemo(() => {
    const config = pageConfig
    const res: Turple<typeof ACTIVITY_LIST, ModuleType> = {} as Turple<typeof ACTIVITY_LIST, ModuleType>
    Object.keys(config).forEach((_item) => {
      const { props = {} } = config[_item]
      const dataIndex = config[_item]?.otherProps?.type
      if (ACTIVITY_LIST.includes(dataIndex)) {
        // const visible = props.visible ?? true
        res[dataIndex] = {
          treeKey: _item,
        }
      }
    })
    return res
  }, [pageConfig])
  const platform = isWeb ? 'web' : 'mobile'

  const handleChange = (isChecked: boolean, _item: keyof typeof ACTIVITYS_MAP) => {
    console.log(modules, isChecked, '_item', _item)
    if (!isChecked) {
      deleteComponentByKey({
        key: modules[_item].treeKey,
        parentKey: '0',
        parentPropName: '',
      })
      return
    }

    const childNodes = [...pageConfig[0].childNodes]
    childNodes.sort((a, b) => +a - +b)

    const newKey = childNodes[childNodes.length - 1] + 1

    if (platform === 'mobile' && _item === 'combination') {
      addChildComponent({
        newKey: `${newKey}`,
        componentName: COMPONENT_NAME[_item][platform]['container'],
        parentPropName: '',
        parentKey: '0',
        childProps: {
          addBtnText: translate('web.resource.marketing.tianjiazijiedian'),
          canDelete: true,
          childComponentName: COMPONENT_NAME[_item][platform]['childContainer'],
          childNodes: [],
          childProps: {
            addBtnText: translate('web.resource.marketing.tianjiacuxiaojiedian'),
            canDelete: true,
            childComponentName: 'Combination.Item',
            otherProps: {
              type: `combinationItemProduct`,
            },
            childProps: {
              otherProps: {
                type: `combinationItem`,
              },
            },
          },
          otherProps: { type: _item },
          props: { visible: true, theme: 0, title: ACTIVITYS_MAP[_item].title },
          title: ACTIVITYS_MAP[_item].title,
        },
      })
      return
    }

    addChildComponent({
      newKey: `${newKey}`,
      componentName: COMPONENT_NAME[_item][platform]['container'],
      parentPropName: '',
      parentKey: '0',
      childProps: {
        addBtnText: translate('web.resource.marketing.tianjiazijiedian'),
        canDelete: false,
        childComponentName: COMPONENT_NAME[_item][platform]['childContainer'],
        childNodes: [],
        childProps: {
          otherProps: {
            type: `${_item}Item`,
          },
        },
        otherProps: { type: _item },
        props: { visible: true, theme: 0, title: ACTIVITYS_MAP[_item].title },
        title: ACTIVITYS_MAP[_item].title,
      },
    })
  }

  return (
    <div className={styles.module}>
      {Object.keys(ACTIVITYS_MAP).map((_item: keyof typeof ACTIVITYS_MAP) => {
        // const { visible, title, dataIndex } = _item;
        const { title, image } = ACTIVITYS_MAP[_item]
        const isChecked = modules[_item] ? true : false
        return (
          <div className={styles.moduleItem} key={_item}>
            <div
              style={{
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img style={{ width: '24px', height: '24px' }} src={image} />
              <div style={{ margin: '8px 0' }}>{title}</div>
              <div>
                <Switch size="small" checked={isChecked} onChange={() => handleChange(!isChecked, _item)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WebComponentModule
