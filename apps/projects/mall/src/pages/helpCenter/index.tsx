import { Menu } from 'antd'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import ImageBox from '@apps/components/src/web/ImageBox'
import useLink from '@/hooks/useLink'
import HelmetProvider from '@/context/helmetProvider'
import useHelpInfo from './hooks/useHelpInfo'
import styles from './index.module.less'
import './index.css'

const HelpCenter: React.FC = () => {
  const { id } = useParams() as any
  const { mallInfo, mallUrl } = useGlobalConext()
  const { linkPrefix } = useLink()
  const { menulist, selectedKeys, openKeys, helpInfoDetail, setOpenKeys, getHelpInfoContent } = useHelpInfo(
    mallInfo?.type === 1 ? mallInfo?.id : mallUrl?.defaultEnterprise?.id,
  )
  const translate = getWebIntl()

  const upDataContent = (memuKey: string) => {
    getHelpInfoContent(memuKey)
  }

  useEffect(() => {
    if (id) {
      getHelpInfoContent(id)
    }
  }, [])

  const seoState = useMemo(() => {
    return {
      title: translate('web.resource.mall.bangzhuzhongxin'),
      keyword: translate('web.resource.mall.bangzhuzhongxin'),
      description: translate('web.resource.mall.bangzhuzhongxin'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles['help_center_box']}>
        <div className={styles['help_center_head_box']}>
          <div className={styles['help_center_head']}>
            <div className={styles['help_center_logo']}>
              <a href={linkPrefix()}>
                <ImageBox width={160} height={48} src={mallInfo?.logoUrl || mallUrl?.defaultEnterprise?.logoUrl} />
              </a>
              <div className={styles['help_center_title']}>{translate('web.resource.mall.bangzhuzhongxin')}</div>
            </div>
          </div>
        </div>
        <div className={styles['help_center_main_box']}>
          <div className={styles['help_center_main']}>
            <div className={styles['help_center_menu']}>
              <Menu
                onSelect={(e) => upDataContent(e.key)}
                onOpenChange={(e) => setOpenKeys(e)}
                mode="inline"
                items={menulist}
                openKeys={openKeys}
                selectedKeys={selectedKeys}
              />
            </div>
            <div className={styles['help_center_content']}>
              {helpInfoDetail && (
                <>
                  <div className={styles['help_title']}>{helpInfoDetail.helpTitle}</div>
                  <div className={styles['help_content']}>
                    <div className="bf-container">
                      <div className="public-DraftEditor-content">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: helpInfoDetail.helpContent,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default HelpCenter
