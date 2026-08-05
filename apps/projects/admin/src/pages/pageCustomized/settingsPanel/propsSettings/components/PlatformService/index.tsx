import React, { useState, Fragment } from 'react'
import { Modal, Input } from 'antd'
import cx from 'classnames'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { UploadImage } from '@apps/components'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import { filterPropsFunction } from '../../../../utils'

interface ServiceItem {
  advertImg: string
  link: string
  advertTitle: string
  advertDescribe: string
}

interface PlatformLogisticsProps {
  dataList: ServiceItem[]
  adornId: number
}

const PlatformService: React.FC<PlatformLogisticsProps> = (props) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)
  const { dataList } = newProps

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

  const handleCancel = () => {
    if (JSON.stringify(props) !== JSON.stringify(newProps)) {
      Modal.confirm({
        content: '您还没有保存修改的内容，是否确认关闭？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          clearSelectedStatus()
        },
      })
    } else {
      clearSelectedStatus()
    }
  }

  const handleConfirmSave = () => {
    changeProps({
      props: newProps,
    })
    clearSelectedStatus()
  }

  const handleChangeForKey = (value: string, changeIndex: number, key: string) => {
    const newList: ServiceItem[] = []
    dataList.forEach((item, index) => {
      const newItem: ServiceItem = { ...item }
      if (index === changeIndex) {
        newItem[key] = value
      }
      newList.push(newItem)
    })
    changeNewProps('dataList', newList)
  }

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div className={styles.platform_goods}>
        {dataList &&
          dataList.map((item, index) => (
            <Fragment key={`setting_line_addItem_${index}`}>
              <div className={styles.setting_title}>
                <span>{item.advertTitle}</span>
              </div>
              <div className={styles.setting_line_addItem}>
                <div className={styles.setting_line_addItem_line}>
                  <div className={styles.setting_line_addItem_line_label}>广告图:</div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <UploadImage
                      imgUrl={item.advertImg}
                      size="48*48"
                      fileMaxSize={20}
                      onChange={(val) => handleChangeForKey(val, index, 'advertImg')}
                    />
                  </div>
                </div>
                <div className={styles.setting_line_addItem_line}>
                  <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>广告标题:</div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <Input
                      className={styles.setting_line_addItem_input}
                      value={item.advertTitle}
                      maxLength={10}
                      onChange={(e) => handleChangeForKey(e.target.value, index, 'advertTitle')}
                    />
                  </div>
                </div>
                <div className={styles.setting_line_addItem_line}>
                  <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>跳转链接:</div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <Input
                      className={styles.setting_line_addItem_input}
                      value={item.link}
                      onChange={(e) => handleChangeForKey(e.target.value, index, 'link')}
                    />
                  </div>
                </div>
                <div className={styles.setting_line_addItem_line}>
                  <div className={cx(styles.setting_line_addItem_line_label, styles.height32)}>广告描述:</div>
                  <div className={styles.setting_line_addItem_line_brief}>
                    <Input
                      className={styles.setting_line_addItem_input}
                      value={item.advertDescribe}
                      maxLength={50}
                      onChange={(e) => handleChangeForKey(e.target.value, index, 'advertDescribe')}
                    />
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    </SettingPanel>
  )
}

export default PlatformService
