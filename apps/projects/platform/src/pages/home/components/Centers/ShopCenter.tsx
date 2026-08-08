import React, { Fragment, useEffect, useMemo, useState } from 'react'
import styles from './center.less'
import create_shop from '@/assets/imgs/create_shop.png'
import { BellOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import Authorize from '../Authorize'
import { authService } from '@apps/services'
import Layout from './layout'
import useGetAuth from '../../hooks/useGetAuth'
interface Iprops {}

const SHOP_MANAGE = '/shopAbility/shopManage'
const SHOP_ABILITY = '/shopAbility'
const CREATE_SHOP = '/shopAbility/shopManage/add'
// 店铺中心：根据当前用户+当前角色是否有店铺能力此菜单权限确定是否显示，再根据自定义布局确定显示及显示顺序
// 1、创建店铺：判断当前用户是否有创建店铺权限，有则显示创建店铺按钮与图标，点击跳转能力中心-店铺能力-店铺管理-创建店铺页
// 2、店铺模板：判断当前用户是否有店铺模板权限，有则显示店铺模板按钮与图标，点击跳转能力中心-店铺能力-店铺管理--店铺模板管理
// 3、店铺装修：判断当前用户是否有店铺模板权限，有则显示店铺装修按钮与图标，点击跳转能力中心-店铺能力-店铺管理--店铺模板管理
// 4、进入店铺中心：判断当前用户是否有店铺模板权限，有则显示进入店铺中心按钮，点击跳转能力中心-店铺能力-店铺管理--店铺模板管理
// 5、如果当前用户有创建店铺权限，但还未创建店铺，则显示：您还没有创建店铺，请先创建店铺，点击创建店铺，跳转能力中心-店铺能力-店铺管理-创建店铺页

const ShopCenter: React.FC<Iprops> = () => {
  const intl = useIntl()
  const { userAuth, authUrlList } = useGetAuth()
  const hasShopAbility = authUrlList?.some((_item) => _item.includes(SHOP_ABILITY))

  const tagList = useMemo(() => {
    return [
      {
        icon: create_shop,
        url: SHOP_MANAGE,
        title: intl.formatMessage({ id: 'menu.shopAbility.shopManage' }),
        hasAuth: authUrlList?.includes(SHOP_MANAGE),
      },
    ]
  }, [userAuth])

  const renderCreateBtn = () => {
    if (!authUrlList?.includes(CREATE_SHOP)) {
      return null
    }
    return <Layout.AlertTip content={intl.formatMessage({ id: 'home.shopCenter.alertTip' })} url={CREATE_SHOP} />
  }

  return (
    <Layout
      hasAuth={hasShopAbility}
      title={intl.formatMessage({ id: 'home.shopCenter.layoutTitle' })}
      tips={intl.formatMessage({ id: 'home.shopCenter.layoutTips' })}
      extra={
        <Authorize url={SHOP_MANAGE}>
          <div>
            <Link to={SHOP_MANAGE}>{intl.formatMessage({ id: 'home.jinrudianpuzhongxin' })}</Link>
          </div>
        </Authorize>
      }
      loading={false}
    >
      <Fragment>
        {renderCreateBtn()}
        <Layout.Tag tagList={tagList}></Layout.Tag>
      </Fragment>
    </Layout>
  )
}

export default ShopCenter
