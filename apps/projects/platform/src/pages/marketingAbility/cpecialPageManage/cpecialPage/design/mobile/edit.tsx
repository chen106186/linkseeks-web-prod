import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useWebIntl } from '@apps/locales'
import Loading from '@/pages/design/components/Loading'
import ToolBar from '@/pages/design/components/toolBar'
import MobileDesignPanel from '@/pages/design/components/MobileDesignPanel'
import MobileSettingPanel from '@/pages/design/mobileSettingPanel'
import MobileEditLeft from '@/pages/design/components/mobileEditLeft'
import { BrickProvider, PageConfigType, resolveMappingPageConfig, updatePageConfig } from '@apps/design-react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import cloneDeep from 'lodash/cloneDeep'
import brickConfig from '@/pages/design/configs'
import { layoutConfig } from './config'
import styles from './index.less'
import { getCommodityAdornTopicPageFind } from '@apps/apis'

interface IProps {
  isPreview: boolean
}

const TemplateList = ['science']

const MobileCpecialPageDesign: React.FC<IProps> = (props) => {
  const { isPreview } = props
  const [loading, setLoading] = useState<boolean>(true)
  const { adornId, template, environment, shopId } = usePageStatus()
  const [theme, setTheme] = useState<string>('theme-ownmall-science')
  const [componentConfigs, setComponentConfigs] = useState<PageConfigType>({})
  const translate = useWebIntl()

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-mall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-mall-${template}`)
    }
    getComponentsConfig()
  }, [])

  /**
   * 获取装修装修信息
   */
  const getDesignConfig = (): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
      const param: any = {
        id: adornId,
      }
      getCommodityAdornTopicPageFind(param)
        .then((res) => {
          if (res.code === 1000 && res.data) {
            resolve(res.data.adornContent)
          } else {
            resolve({})
          }
        })
        .catch((eror) => {
          reject(eror)
        })
    })
  }

  const getComponentsConfig = async () => {
    const designConfig = await getDesignConfig()
    const _mallLayoutConfig: any = cloneDeep(layoutConfig)

    _mallLayoutConfig['0'].childNodes = [..._mallLayoutConfig['0'].childNodes]

    const config = {
      ..._mallLayoutConfig,
    }

    const finalConfig = resolveMappingPageConfig(config, {})

    setComponentConfigs(finalConfig)
    setLoading(false)
    updatePageConfig(finalConfig)
  }

  return !loading && brickConfig ? (
    <BrickProvider config={brickConfig}>
      <Helmet>
        <title>{translate('web.resource.marketing.zhuantiyezhuangxiu')}</title>
      </Helmet>
      <main className={styles['wrapper']}>
        <ToolBar
          type={isPreview ? 2 : 1}
          title={translate('web.resource.marketing.zhuantiyezhuangxiu')}
          showActions={!isPreview}
          layoutType={LAYOUT_TYPE.own}
          adornId={Number(adornId)}
        />
        <div className={styles['content']}>
          <MobileEditLeft />
          <div className={styles['app-wrapper']}>
            <div className={styles['app-canvas-container']}>
              <MobileDesignPanel onlyEidt isPreview={isPreview} theme={theme} pageConfig={componentConfigs} />
            </div>
          </div>
          {!isPreview && (
            <MobileSettingPanel shopId={shopId} environment={Number(environment)} layoutType={LAYOUT_TYPE.own} />
          )}
        </div>
      </main>
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default MobileCpecialPageDesign
