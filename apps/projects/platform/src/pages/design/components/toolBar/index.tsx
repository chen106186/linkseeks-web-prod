import React, { useCallback, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { STATE_PROPS, PageConfigType, changeProps } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { postCommodityAdornManageSave, postCommodityAdornTopicPageUpdate } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMobileDesignParam, paramsOwnMall, paramsShop } from './returnSaveParams'
import { getCpecialPageParam, getDesignParam } from './webParams'
import Color from './color'
import styles from './index.less'

interface ToolBarPropsType {
  type?: number
  title?: string
  showActions?: boolean
  adornId?: number
  layoutType?: LAYOUT_TYPE
  templateInfo?: any
  isWeb?: boolean
}

const ToolBar: React.FC<ToolBarPropsType> = (props) => {
  const intl = useIntl()
  const {
    type = 1,
    title = intl.formatMessage({ id: 'editor.channel.menu.home', defaultMessage: '首页' }),
    showActions,
    templateInfo,
    layoutType,
    isWeb = false,
  } = props
  const { shopId, storeId, adornId } = usePageStatus()
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const { pageConfig } = useSelector<{ pageConfig: PageConfigType }, STATE_PROPS>(['pageConfig'])

  const handleGoBack = () => {
    if (type === 1) {
      Modal.confirm({
        content: intl.formatMessage({ id: 'common.tip.designpage.leave.confirm' }),
        okText: intl.formatMessage({ id: 'common.button.confirm' }),
        className: styles.modal_confirm,
        cancelText: intl.formatMessage({ id: 'common.button.cancel' }),
        onOk: () => {
          history.goBack()
        },
      })
    } else {
      history.goBack()
    }
  }

  const handleSave = useCallback(() => {
    if (adornId) {
      if (layoutType === LAYOUT_TYPE.shop) {
        if (isWeb) {
          saveAdorn(getDesignParam(pageConfig, adornId, shopId, storeId))
        } else {
          saveAdorn(getMobileDesignParam(pageConfig, adornId, shopId, storeId))
        }
      } else if (layoutType === LAYOUT_TYPE.cpecialPage) {
        saveCpecialPage(getCpecialPageParam(pageConfig, adornId, shopId))
      } else if (layoutType === LAYOUT_TYPE.own) {
        if (isWeb) {
          saveAdorn(getDesignParam(pageConfig, adornId, shopId))
        } else {
          saveAdorn(getMobileDesignParam(pageConfig, adornId, shopId))
        }
      }
    }
  }, [pageConfig])

  const saveCpecialPage = (param) => {
    postCommodityAdornTopicPageUpdate(param)
      .then((res) => {
        setSaveLoading(false)
        if (res.code === 1000) {
          message.destroy()
          message.success(intl.formatMessage({ id: 'common.tip.save.success' }))
        }
      })
      .catch(() => {
        setSaveLoading(false)
      })
  }

  const saveAdorn = (param) => {
    postCommodityAdornManageSave(param)
      .then((res) => {
        setSaveLoading(false)
        if (res.code === 1000) {
          message.destroy()
          message.success(intl.formatMessage({ id: 'common.tip.save.success' }))
        }
      })
      .catch(() => {
        setSaveLoading(false)
      })
  }

  const handleChangeColor = (hex: string) => {
    changeProps({
      treeKey: '0',
      props: {
        backgroundColor: hex,
      },
    })
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar_back_btn} onClick={() => handleGoBack()}>
        <ArrowLeftOutlined />
      </div>
      <div className={styles.toolbar_title}>
        <span>
          {type === 1
            ? intl.formatMessage({ id: 'editor.toolbar.title.edit' })
            : intl.formatMessage({ id: 'editor.toolbar.title.preview' })}
        </span>
        <label>{title}</label>
      </div>
      <div className={styles.toolbar_main}>
        {layoutType === LAYOUT_TYPE.cpecialPage && showActions && <Color onChange={handleChangeColor} />}
      </div>
      {showActions && (
        <div className={styles.toolbar_actions}>
          <Button type="link" onClick={() => handleGoBack()}>
            {intl.formatMessage({ id: 'common.button.cancel' })}
          </Button>
          <Button loading={saveLoading} type="primary" onClick={() => handleSave()}>
            {intl.formatMessage({ id: 'common.button.save' })}
          </Button>
        </div>
      )}
    </div>
  )
}

ToolBar.defaultProps = {
  type: 1,
  showActions: false,
}

export default ToolBar
