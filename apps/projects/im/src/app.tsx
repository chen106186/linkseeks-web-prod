import { defineConfig } from '@linkseeks/router-core'
import { RouterManager, Router } from '@linkseeks/router-manager'
import { authService } from '@apps/services'
import React from 'react'
import { initIMSDK } from './IM'
import { isPC } from './components/TUIKit'
import { getMemberAbilityInfoGetLoginInfoByToken } from '@apps/apis'
import { getQueryStringParams } from '@apps/utils'

export default defineConfig({
  indexRouter: '/chatList',

  notFoundRouter: '/chatList',

  beforeRouterNavigate({ path }) {
    const whiteList = ['/404']

    return true
  },

  async routerRender() {
    const { t } = getQueryStringParams(location.href)
    const { code } = await initIMSDK()
    const { data, code: tokenCode } = await getMemberAbilityInfoGetLoginInfoByToken()
    if (t && tokenCode === 1000) {
      authService.setAuth({
        ...data,
        accessToken: t,
      })
    }
    if (code === 1000) {
      const search = window.location.search
      if (isPC) {
        Router.redirect('/chatList' + search)
      } else {
        Router.redirect('/chatRoom' + search)
      }
      return true
    } else {
      return false
    }
  },

  noPermissionPage: <div>无权限</div>,

  // remoteRouteRequest() {
  //   return authService.getAuth
  // },
})
