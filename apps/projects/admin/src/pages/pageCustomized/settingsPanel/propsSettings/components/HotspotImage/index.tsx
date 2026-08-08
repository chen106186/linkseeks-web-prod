import React, { useEffect, useState } from 'react'
import SettingPanel from '@/pages/pageCustomized/components/SettingPanel'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { Col, Form, Modal, Row, Slider, Space, message } from 'antd'
import { useWebIntl } from '@apps/locales'
import { HotspotItemType } from '@apps/design-ui/src/Web/HotspotImage'
import { ImageBox, LineTitle, StandardUpload } from '@apps/components'
import { Button } from '@linkseeks/ui'
import shortid from 'shortid'
import { PlusIcon } from '@linkseeks/icons'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import MultiCrops from './MultiCrops'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import styles from './index.less'

interface IProps {
  verticalMargin: number
  imgUrl: string
  hotspotList: HotspotItemType[]
  layoutType: LAYOUT_TYPE
}

const HotspotImage: React.FC<IProps> = (props) => {
  const { verticalMargin = 8, imgUrl, hotspotList, layoutType } = props
  const [componentForm] = Form.useForm()
  const [form] = Form.useForm()
  const [changeState, setChangeState] = useState<boolean>(false)
  const [hotspotImgUrl, setHotspotImgUrl] = useState<string>()
  const [tempVerticalMargin, setTempVerticalMargin] = useState<number>(verticalMargin)
  const [hotspotModalVisible, setHotspotModalVisible] = useState<boolean>(false)
  const [currentHotspotList, setCurrentHotspotList] = useState<HotspotItemType[]>([])
  const [currentEditHotspot, setCurrentEditHotspot] = useState<HotspotItemType>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const translate = useWebIntl()

  useEffect(() => {
    if (hotspotList && hotspotList.length > 0) {
      setCurrentHotspotList(hotspotList)
    }
  }, [hotspotList])

  useEffect(() => {
    if (imgUrl) {
      setHotspotImgUrl(imgUrl)
    } else {
      setHotspotImgUrl(undefined)
    }
  }, [imgUrl])

  const handleCancel = () => {
    clearSelectedStatus()
  }

  const handleConfirmSave = (e) => {
    componentForm.validateFields().then((values) => {
      e.preventDefault()
      if (!changeState) {
        clearSelectedStatus()
        return
      }

      changeProps({
        props: {
          ...values,
          imgUrl: hotspotImgUrl,
          linkdisable: true,
          hotspotList: currentHotspotList,
          canDelete: true,
        },
      })
      clearSelectedStatus()
    })
  }

  /** 添加热区 */
  const handleAddHotArea = () => {
    if (currentHotspotList && currentHotspotList.length > 0) {
      const lastIndex = currentHotspotList[currentHotspotList.length - 1].zIndex || 1
      setCurrentHotspotList(
        produce(currentHotspotList, (oldState) => {
          const newState = oldState.map((item) => {
            return {
              ...item,
            }
          })
          newState.push({
            shortid: shortid.generate(),
            width: 115,
            height: 115,
            x: 8,
            y: 8,
            zIndex: lastIndex + 1,
          })
          return newState
        }),
      )
    } else {
      setCurrentHotspotList([
        {
          shortid: shortid.generate(),
          width: 115,
          height: 115,
          x: 8,
          y: 8,
          zIndex: 1,
        },
      ])
    }
  }

  const handleSaveHotArea = () => {
    // 校验已添加的热区是否都已设置链接
    if (currentHotspotList.some((item) => !item.type)) {
      message.destroy()
      message.error(translate('web.resource.shop.qingshezhirequdaohangleixing'))
      return
    }
    setChangeState(true)
    setHotspotModalVisible(false)
  }

  const changeCoordinate = (coordinate, index, coordinates) => {
    setCurrentHotspotList(coordinates)
  }

  const deleteCoordinate = (coordinate, index, coordinates) => {
    setCurrentHotspotList(coordinates)
  }

  const _onChoose = (item: HotspotItemType) => {
    setCurrentEditHotspot(item)
    if (item.type) {
      form.setFieldsValue({
        type: item.type,
        value: item.value,
        valueText: item.valueText,
      })
    }
    setModalVisible(true)
  }

  const handleModalConfirm = () => {
    form.validateFields().then((values) => {
      setCurrentHotspotList(
        produce(currentHotspotList, (oldState) => {
          return oldState.map((item) => {
            if (item.zIndex === currentEditHotspot?.zIndex) {
              return {
                ...item,
                ...values,
              }
            }
            return item
          })
        }),
      )
      setModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <Form
        form={componentForm}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={() => setChangeState(true)}
      >
        <Form.Item label={translate('web.resource.shop.shangxiabianju')}>
          <Row gutter={12}>
            <Col span={22}>
              <Form.Item name="verticalMargin" initialValue={verticalMargin}>
                <Slider
                  min={0}
                  max={100}
                  onChange={(value) => setTempVerticalMargin(value)}
                  tooltip={{
                    open: false,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <span style={{ position: 'relative', top: 6 }}>{tempVerticalMargin}px</span>
            </Col>
          </Row>
        </Form.Item>
        <LineTitle
          style={{ marginTop: 24 }}
          extra={
            <Form.Item name="imgUrl" initialValue={imgUrl} noStyle>
              <StandardUpload onChange={(value) => setHotspotImgUrl(value)} showUploadList={false}>
                <Button type="primary" icon={<PlusIcon />}>
                  {translate('web.common.shangchuan')}
                </Button>
              </StandardUpload>
            </Form.Item>
          }
        >
          <span>{translate('web.resource.shop.tupianpeizhi')}</span>
          <label className={styles['line-subtitle']}>{translate('web.resource.shop.dianjitupianbianjirequ')}</label>
        </LineTitle>
        <div className={styles['hotspot-img-wrap']}>
          <div className={styles['hotspot-img-upload']}>
            {hotspotImgUrl && <ImageBox height={175} width={550} src={hotspotImgUrl} />}
            {currentHotspotList && currentHotspotList.length > 0 && (
              <div className={styles['hotspot-count']}>
                <span>{translate('web.resource.shop.yitianjiaduogerequ', { count: currentHotspotList.length })}</span>
              </div>
            )}
            {hotspotImgUrl && (
              <div className={styles['hotspot-img-bottom']}>
                <Space>
                  <Button onClick={() => setHotspotModalVisible(true)}>
                    {translate('web.resource.shop.bianjirequ')}
                  </Button>
                  <Button
                    danger
                    onClick={() => {
                      setHotspotImgUrl(undefined)
                      setCurrentHotspotList([])
                      setChangeState(true)
                    }}
                  >
                    {translate('web.common.delete')}
                  </Button>
                </Space>
              </div>
            )}
          </div>
        </div>
      </Form>
      <Modal
        title={translate('web.resource.shop.requbianji')}
        open={hotspotModalVisible}
        maskClosable={false}
        centered
        onOk={() => {
          setHotspotModalVisible(false)
        }}
        onCancel={() => {
          setTimeout(() => {
            setHotspotModalVisible(false)
          }, 200)
        }}
        footer={
          <div>
            <Button type="primary" onClick={handleAddHotArea}>
              {translate('web.resource.shop.tianjiarequ')}
            </Button>
            <Button onClick={handleSaveHotArea}>{translate('web.common.save')}</Button>
          </div>
        }
        width={680}
      >
        <div className={styles.hotspot_area_modal}>
          <div className={styles.header_content}>
            <div className={styles.step_content}>
              <span className={styles.step_num}>1</span>
              <span className={styles.step_text}>{translate('web.resource.shop.tianjiarequ')}</span>
              <span>-</span>
            </div>
            <div className={styles.step_content}>
              <span className={styles.step_num}>2</span>
              <span className={styles.step_text}>{translate('web.resource.shop.tiaozhengrequdaxiaoheweizhi')}</span>
              <span>-</span>
            </div>
            <div className={styles.step_content}>
              <span className={styles.step_num}>3</span>
              <span className={styles.step_text}>{translate('web.resource.shop.shezhidaohangleixing')}</span>
              <span>-</span>
            </div>
            <div className={styles.step_content}>
              <span className={styles.step_num}>4</span>
              <span className={styles.step_text}>{translate('web.resource.shop.baocunshengxiao')}</span>
              <span></span>
            </div>
          </div>
          <div className={styles.img_content}>
            <MultiCrops
              src={hotspotImgUrl}
              width={630}
              coordinates={currentHotspotList}
              onChange={changeCoordinate}
              onDelete={deleteCoordinate}
              onItemChooseMenu={_onChoose}
            />
          </div>
        </div>
      </Modal>
      <CommonItemModal
        title={translate('web.resource.shop.requpeizhi')}
        layoutType={layoutType}
        visible={modalVisible}
        formSchema={[
          {
            type: ModalFormType.NavType,
            name: 'type',
            label: translate('web.resource.shop.daohangleixing'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingxuanze'),
              },
            ],
          },
        ]}
        form={form}
        onOk={handleModalConfirm}
        onCancel={() => {
          setModalVisible(false)
          setCurrentEditHotspot(undefined)
          form.resetFields()
        }}
      />
    </SettingPanel>
  )
}

export default HotspotImage
