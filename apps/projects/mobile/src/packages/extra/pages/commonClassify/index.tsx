import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { setNavigationBarTitle, useRouter } from '@apps/mobile-services/utils/taro'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { View } from '@apps/mobile-ui'
import MallTabBottom from '@/components/MallTabBottom'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import ClassifyTab from './components/classifyTab'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { THEME_COLORS } from '@/constants/theme'
const ShopClassify: React.FC<{}> = () => {
  const { safeBottomHeight } = useSafeArea()
  const { id, hasTab, layoutType, categoryId } = useRouter()?.params || {}
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'common_classify_navigationBarTitleText'}) })
  }, [])
  return (
    <MallTabBottom visible={hasTab === 'true'} layoutType={layoutType as LAYOUT_TYPE} activeUrl="extra/commonClassify">
      <View
        className={styles['shopClassify-container']}
        style={
          safeBottomHeight && !hasTab
            ? {
                paddingBottom: `${safeBottomHeight}PX`,
                backgroundColor: THEME_COLORS.page,
              }
            : {}
        }
      >
        <ClassifyTab id={id} categoryId={categoryId} />
      </View>
    </MallTabBottom>
  )
}
export default GlobalWrapper(ShopClassify)
