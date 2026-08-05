import React, { forwardRef, useState, useCallback, useEffect } from 'react'
import { Button, Input, Modal } from 'antd'
import { UploadImage } from '@apps/components'
import { ReactSortable } from 'react-sortablejs'
import { isEmpty } from 'lodash'
import { clearSelectedStatus, changeProps, produce } from '@apps/design-core'
import cx from 'classnames'
import { PlusOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import upIcon from '@/assets/icons/up_icon.png'
import downIcon from '@/assets/icons/down_icon.png'
import deleteIcon from '@/assets/icons/delete_icon.png'
import sortIcon from '@/assets/icons/sort_icon.png'
import styles from './index.less'
import SettingPanel from '../../../../components/SettingPanel'
import { filterPropsFunction } from '../../../../utils'

interface AdvertItemType {
  id: number
  /**
   * 广告名称
   */
  name: string
  /**
   * 广告图片
   */
  imgUrl: string
  /**
   * 链接
   */
  link: string
  /**
   * 排序
   */
  sort: number
  expand?: boolean
}

interface AdvertSettingPropsType {
  advertList: AdvertItemType[]
  onChange: Function
  type: 'banner' | 'bannerRight' | 'bannerBottom' | 'floorBanner' | 'service'
  adornId: number
  categoryid?: number
}

const PlatformAdvertSetting: React.FC<AdvertSettingPropsType> = forwardRef((props) => {
  const { advertList = [], adornId, type } = props
  const [list, setList] = useState<AdvertItemType[]>([])
  const [confirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)

  useEffect(() => {
    initDataList()
  }, [advertList])

  const initDataList = () => {
    if (advertList) {
      const newDataList = produce(advertList, (oldAdvertList) => {
        oldAdvertList.map((item: AdvertItemType, index: number) => {
          item.sort = index + 1
          item.expand = item.expand || false
          return item
        })
      })
      setList(newDataList)
    }
  }

  const getImgSize = () => {
    switch (type) {
      case 'banner':
        return '520*292'
      case 'bannerRight':
        return '200*292'
      case 'bannerBottom':
        return '252*204'
    }
  }

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

  const sortUp = (index: number, item: AdvertItemType) => {
    const newList = JSON.parse(JSON.stringify(list))
    const tempItem = JSON.parse(JSON.stringify(item))
    const temp = newList[index - 1]
    newList[index - 1] = item
    newList[index - 1].sort = temp.sort
    newList[index] = temp
    newList[index].sort = tempItem.sort
    setList(newList)
    changeNewProps('advertList', newList)
  }

  const sortDown = (index: number, item: AdvertItemType) => {
    const newList = JSON.parse(JSON.stringify(list))
    const temp = newList[index + 1]
    const tempItem = JSON.parse(JSON.stringify(item))
    newList[index + 1] = item
    newList[index + 1].sort = temp.sort
    newList[index] = temp
    newList[index].sort = tempItem.sort
    setList(newList)
    changeNewProps('advertList', newList)
  }

  const addSliderItem = () => {
    const newList = JSON.parse(JSON.stringify(list))
    let sort = 0
    if (newList.length <= 0) {
      sort = 1
    } else {
      sort = newList[newList.length - 1].sort + 1
    }

    const tempItem: any = {
      adornId: Number(adornId),
      name: '',
      imgUrl: '',
      link: '',
      sort,
      expand: true,
    }

    newList.push(tempItem)
    setList(newList)
    changeNewProps('advertList', newList)
  }

  const handleDeleteItem = (index: number) => {
    const newList = JSON.parse(JSON.stringify(list))
    newList.splice(index, 1)
    let sort = 1
    newList.map((item) => {
      item.sort = sort
      sort++
    })
    setList(newList)
    changeNewProps('advertList', newList)
  }

  const handleExpand = (sort: number, state: boolean) => {
    const newList = JSON.parse(JSON.stringify(list))
    newList.map((item) => {
      if (item.sort === sort) {
        item.expand = state
      } else {
        item.expand = false
      }
    })
    setList(newList)
  }

  const handleKeyChange = (value: string, sort: number, key: string) => {
    const newList = JSON.parse(JSON.stringify(list))
    newList.map((item) => {
      if (item.sort === sort) {
        item[key] = value
      }
    })
    setList(newList)
    changeNewProps('advertList', newList)
  }

  const handleConfirmSave = useCallback(
    (e: any) => {
      e.preventDefault()
      changeProps({
        props: newProps,
      })
      clearSelectedStatus()
    },
    [newProps],
  )

  /**
   * 检查广告数据完整性
   */
  // const checkAdvertList = (dataList: any) => {
  //   if (isEmpty(dataList)) {
  //     message.destroy();
  //     message.error('请至少添加一个广告');
  //     return false;
  //   }

  //   return dataList.every(item => {
  //     message.destroy();
  //     if (!item.name) {
  //       message.error('请输入广告名称');
  //       return false;
  //     } else if (!item.imgUrl) {
  //       message.error('请上传广告图片');
  //       return false;
  //     } else {
  //       return true;
  //     }

  //   });
  // };

  const handleCancel = useCallback(() => {
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
  }, [newProps])

  return (
    <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}>
      <div className={styles.advert_setting}>
        <ReactSortable
          list={list}
          setList={(newList) => {
            setList(newList)
            if (!isEmpty(newList)) {
              changeProps({
                props: Object.assign({ ...props }, { advertList: newList }),
              })
            }
          }}
          handle=".draghandle"
        >
          {list &&
            list.map((item, index) => (
              <div className={styles.advert_setting_line} key={`advert_setting_${index}`}>
                <div className={styles.advert_setting_line_sort}>{item.sort}</div>
                <div className={styles.advert_setting_line_main}>
                  <div
                    className={styles.advert_setting_line_name}
                    onClick={() => handleExpand(item.sort, !item.expand)}
                  >
                    {item.expand ? (
                      <CaretDownOutlined className={styles.icon} />
                    ) : (
                      <CaretRightOutlined className={styles.icon} />
                    )}
                    <span>{item.name}</span>
                  </div>
                  {!!item.expand && (
                    <div className={styles.advert_setting_line_addItem}>
                      <div className={styles.advert_setting_line_addItem_line}>
                        <div className={styles.advert_setting_line_addItem_line_label}>名称</div>
                        <div className={styles.advert_setting_line_addItem_line_brief}>
                          <Input
                            className={styles.advert_setting_line_addItem_input}
                            value={item.name}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'name')}
                            maxLength={15}
                          />
                        </div>
                      </div>
                      <div className={styles.advert_setting_line_addItem_line}>
                        <div className={styles.advert_setting_line_addItem_line_label}>图片</div>
                        <div className={styles.advert_setting_line_addItem_line_brief}>
                          <UploadImage
                            imgUrl={item.imgUrl}
                            size={getImgSize()}
                            fileMaxSize={500}
                            onChange={(val) => handleKeyChange(val, item.sort, 'imgUrl')}
                          />
                        </div>
                      </div>
                      <div className={styles.advert_setting_line_addItem_line}>
                        <div className={styles.advert_setting_line_addItem_line_label}>链接</div>
                        <div className={styles.advert_setting_line_addItem_line_brief}>
                          <Input
                            className={styles.advert_setting_line_addItem_input}
                            value={item.link}
                            onChange={(e) => handleKeyChange(e.target.value, item.sort, 'link')}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.advert_setting_line_operation}>
                  <Button
                    type="link"
                    onClick={() => handleDeleteItem(index)}
                    className={styles.advert_setting_line_operation_btn}
                    icon={<img className={styles.advert_setting_line_operation_btn_icon} src={deleteIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === 0}
                    onClick={() => sortUp(index, item)}
                    className={styles.advert_setting_line_operation_btn}
                    icon={<img className={styles.advert_setting_line_operation_btn_icon} src={upIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    disabled={index === list.length - 1}
                    onClick={() => sortDown(index, item)}
                    className={styles.advert_setting_line_operation_btn}
                    icon={<img className={styles.advert_setting_line_operation_btn_icon} src={downIcon} />}
                  ></Button>
                  <Button
                    type="link"
                    className={cx(styles.advert_setting_line_operation_btn, 'draghandle')}
                    icon={<img className={styles.advert_setting_line_operation_btn_icon} src={sortIcon} />}
                  ></Button>
                </div>
              </div>
            ))}
        </ReactSortable>
        <Button onClick={addSliderItem} className={styles.add_btn} icon={<PlusOutlined />}>
          添加广告
        </Button>
      </div>
    </SettingPanel>
  )
})

PlatformAdvertSetting.displayName = 'PlatformAdvertSetting'

export default PlatformAdvertSetting
