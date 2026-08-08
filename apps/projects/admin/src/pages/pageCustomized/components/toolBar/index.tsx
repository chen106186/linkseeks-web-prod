import React, { useCallback, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { postCommodityAdornManageSave, postCommodityAdornTopicPageUpdate } from '@apps/apis'
import { STATE_PROPS, PageConfigType, changeProps } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { getCpecialPageParam, getDesignParam } from './webParams'
import { paramsBusiness, paramsClient } from './returnSaveParams'
import Color from './color'
import styles from './index.less'

interface ToolBarPropsType {
  type?: number
  title?: string
  showActions?: boolean
  adornId: number
  saveType?: number
  // 接口获取的装修数据
  appConfig?: any
  templateInfo?: any
  layoutType?: LAYOUT_TYPE
  isWeb?: boolean
}

const ToolBar: React.FC<ToolBarPropsType> = (props) => {
  const {
    type = 1,
    title = '首页',
    layoutType,
    showActions,
    templateInfo,
    saveType = 1,
    isWeb = false,
    appConfig,
  } = props
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const { pageConfig } = useSelector<{ pageConfig: PageConfigType }, STATE_PROPS>(['pageConfig'])
  const { adornId, shopId } = usePageStatus()

  const handleGoBack = () => {
    if (type === 1) {
      Modal.confirm({
        content: '是否确认离开模板装修页面？',
        okText: '确认',
        className: styles.modal_confirm,
        cancelText: '取消',
        onOk: () => {
          history.goBack()
        },
      })
    } else {
      history.goBack()
    }
  }

  const handleSave = useCallback(() => {
    if (isWeb) {
      if (layoutType === LAYOUT_TYPE.joint) {
        saveAppEnterprise(getDesignParam(pageConfig, adornId, shopId))
      } else if (layoutType === LAYOUT_TYPE.cpecialPage) {
        saveCpecialPage(getCpecialPageParam(pageConfig, adornId, shopId))
      }
    } else {
      saveAppEnterprise(paramsBusiness(adornId, shopId, pageConfig))
    }
  }, [pageConfig])

  const saveCpecialPage = (param) => {
    postCommodityAdornTopicPageUpdate(param)
      .then((res) => {
        setSaveLoading(false)
        if (res.code === 1000) {
          message.destroy()
          message.success('保存成功')
        }
      })
      .catch(() => {
        setSaveLoading(false)
      })
  }

  const saveAppEnterprise = (param) => {
    setSaveLoading(true)
    postCommodityAdornManageSave(param).then((res) => {
      if (res.code === 1000) {
        message.destroy()
        message.success('保存成功')
      }
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
        <span>{type === 1 ? '正在编辑：' : '正在预览：'}</span>
        <label>{title}</label>
      </div>
      <div className={styles.toolbar_main}>
        {layoutType === LAYOUT_TYPE.cpecialPage && showActions && <Color onChange={handleChangeColor} />}
      </div>
      {showActions && (
        <div className={styles.toolbar_actions}>
          <Button type="link" onClick={() => handleGoBack()}>
            取消
          </Button>
          <Button icon={<SaveOutlined />} loading={saveLoading} type="primary" onClick={() => handleSave()}>
            保存
          </Button>
        </div>
      )}
    </div>
  )
}

ToolBar.defaultProps = {
  type: 1,
  title: '首页',
  showActions: false,
}

export default ToolBar
