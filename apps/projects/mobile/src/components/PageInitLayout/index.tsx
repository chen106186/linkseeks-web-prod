import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { init } from '@linkseeks/i18n'
import { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import React from 'react'

const PageInitLayout = ({ children, loading }) => {
  return loading ? <View>loading</View> : children
}

export default PageInitLayout
