import React, { useMemo, useState } from 'react'
import { Input, Row, Col, Select, Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { UploadImage, ImageBox } from '@apps/components'
import StatusTag from '@/components/StatusTag'

import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'
import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import ActivityDrawer from '@/pages/pageCustomized/components/drawers/activityDrawer'

import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'
import ActivityImage from '@/assets/activity/ActivityImage.svg'
import { priceFormat } from '@/utils/numberFomat'
import styles from './index.less'

interface CardNavItemProps {
  name: string
  // 1商城，3积分商品，4店铺，5资讯
  type: any
  // 橱窗广告图
  banner: string
  // 橱窗内页广告图
  inner: string
  icon: string
  idList: number[]
  // 当前选中组件的key
  selectedKey?: any
  shopId: number
  // 频道 1: 店铺中心; 2:人气店铺; 3:行情资讯; 4:积分兑换
  id?: any
  dataList?: any
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
  empty?: boolean
  environment: number
}

const RedirectTypeList = [
  {
    value: 1,
    label: '商品',
  },
  {
    value: 2,
    label: '活动',
  },
  {
    value: 3,
    label: '积分',
  },
  {
    value: 4,
    label: '店铺',
  },
  {
    value: 6,
    label: '品牌',
  },
]

const ShowCase: React.FC<CardNavItemProps> = (props: CardNavItemProps) => {
  const { name, type, banner, inner, id, dataList, environment, property = 1, empty, shopId, selectedKey } = props
  const [mixVisible, setMixVisible] = useState<boolean>(false)
  const [actVisible, setActVisible] = useState<boolean>(false)
  const [commodityVisible, setCommodityVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>()

  const _onChangeByKey = (val: any, key: string, title?: string) => {
    const newProps: any = {
      [key]: val,
    }
    const others: any = {}
    if (key === 'type' && val !== type) {
      newProps.id = undefined
      newProps.dataList = undefined
      if (val === 4) {
        others.childComponentName = 'RecommendShop.Item'
        others.addBtnText = '添加店铺'
      } else {
        others.childComponentName = ''
        others.addBtnText = ''
      }
    }
    if (!empty) {
      if (key === 'icon') {
        newProps.empty = false
      }
    }

    changeProps({
      title: title ? title : name,
      props: Object.assign({ ...props }, newProps),
      ...others,
    })
  }

  const _showChoose = useMemo(() => {
    if (type === 6 || type === 5 || type === 3) {
      return false
    }
    if (!type) {
      return false
    }
    return true
  }, [type])

  const _showByType = useMemo(() => {
    if (!type) {
      return null
    }
    switch (type) {
      case 1:
        return (
          <div className={styles['banner-box']}>
            <div className={styles['banner-box-label']}>推荐商品</div>
            <Button onClick={() => _onChoose()}>选择</Button>
          </div>
        )
      case 2:
        return (
          <div className={styles['banner-box']}>
            <div className={styles['banner-box-label']}>推荐活动</div>
            <Button onClick={() => _onChoose()}>选择</Button>
          </div>
        )
      case 3:
        return (
          <div className={styles['banner-box']}>
            <div className={styles['banner-box-label']}>积分商品</div>
            <Button onClick={() => _onChoose()}>选择</Button>
          </div>
        )
      // case 4:
      //   return (
      //     <div className={styles['banner-box']}>
      //       <div className={styles['banner-box-label']}>推荐店铺</div>
      //       <Button onClick={() => _onChoose()}>选择</Button>
      //     </div>
      //   )
      case 6:
        return (
          <div className={styles['banner-box']}>
            <div className={styles['banner-box-label']}>推荐品牌</div>
            <Button onClick={() => _onChoose()}>选择</Button>
          </div>
        )
    }
  }, [type])

  const _onShopClose = () => {
    setMixVisible(false)
  }

  const _onActClose = () => {
    setActVisible(false)
  }

  const _onCommodityClose = () => {
    setCommodityVisible(false)
  }

  const _onChoose = () => {
    console.log(type, 'type')
    switch (type) {
      case 1:
        setCommodityVisible(true)
        break
      case 2:
        setActVisible(true)
        break
      case 3:
      case 4:
      case 5:
      case 6:
        setMixVisible(true)
        break
    }
  }

  const _handleDeleteItem = (deleteId: number) => {
    if (deleteId) {
      if (type !== 2) {
        changeProps({
          props: Object.assign(
            { ...props },
            {
              id: id.filter((item) => item !== deleteId),
              dataList: dataList.filter((item) => item.id !== deleteId),
            },
          ),
        })
      }
    }
  }

  const _recordDetail = useMemo(() => {
    if (dataList) {
      if (type === 1) {
        return (
          dataList.length > 0 &&
          dataList.map((dataItem) => (
            <>
              <div className={styles['banner-record-commodity-detail']}>
                <ImageBox wrapperStyle={{ marginRight: 8 }} height={60} width={60} src={dataItem?.mainPic} />
                <div className={styles['banner-record-commodity-detail-right']}>
                  <Tooltip title={dataItem?.name}>
                    <div className={styles['banner-record-commodity-detail-right-title']}>{dataItem?.name}</div>
                  </Tooltip>
                  <div className={styles['banner-record-commodity-detail-right-price']}>
                    {dataItem?.min ? `¥ ${priceFormat(dataItem?.min)}` : ''}
                  </div>
                </div>
                <div className={styles['banner-record-mask']}>
                  <DeleteOutlined
                    className={styles['banner-record-mask-delete']}
                    onClick={() => _handleDeleteItem(dataItem?.id)}
                  />
                </div>
              </div>
              {dataItem?.activityList?.length > 0 && (
                <div className={styles['banner-record-commodity-box']}>
                  <div className={styles['banner-record-commodity-label']}>商品活动</div>
                  {dataItem?.activityList?.map((item) => {
                    return (
                      <div className={styles['banner-record-commodity-activityList']}>
                        <img src={ActivityImage} />
                        <div className={styles['banner-record-commodity-activityList-name']}>{item.name}</div>
                        <StatusTag title={item.type} type="danger" />
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          ))
        )
      }
      if (type === 2) {
        return (
          dataList &&
          dataList.id && (
            <div className={styles['banner-record-activity']}>
              <div className={styles['banner-record-activity-right']}>
                <Tooltip title={dataList?.name}>
                  <div className={styles['banner-record-activity-right-top']}>{dataList?.name}</div>
                </Tooltip>
                {dataList?.type === 2 && (
                  <div className={styles['banner-record-activity-right-bottom']}>{dataList?.memberName}</div>
                )}
              </div>
              <div className={styles['banner-record-activity-tag']}>
                <StatusTag
                  title={dataList?.type === 1 ? '平台' : '商家'}
                  type={dataList?.type === 1 ? 'success' : 'primary'}
                />
              </div>
            </div>
          )
        )
      }
      if (type === 3) {
        return (
          dataList.length > 0 &&
          dataList.map((dataItem) => (
            <div className={styles['banner-record-integral']}>
              <ImageBox wrapperStyle={{ marginRight: 8 }} height={40} width={40} src={dataItem?.mainPic} />
              <div className={styles['banner-record-integral-right']}>
                <Tooltip title={dataItem?.name}>
                  <div className={styles['banner-record-integral-right-top']}>{dataItem?.name}</div>
                </Tooltip>
                <div className={styles['banner-record-integral-right-bottom']}>{priceFormat(dataItem?.min)} 积分</div>
              </div>
              <div className={styles['banner-record-mask']}>
                <DeleteOutlined
                  className={styles['banner-record-mask-delete']}
                  onClick={() => _handleDeleteItem(dataItem?.id)}
                />
              </div>
            </div>
          ))
        )
      }
      // if (type === 4) {
      //   return dataList.length > 0 && dataList.map((dataItem) => (
      //     <div className={styles['banner-record-shop']}>
      //       <img src={dataItem?.logo} />
      //       <Tooltip title={dataItem?.memberName}>
      //         <span>{dataItem?.memberName}</span>
      //       </Tooltip>
      //       <div className={styles['banner-record-mask']}>
      //         <DeleteOutlined
      //           className={styles['banner-record-mask-delete']}
      //           onClick={() => _handleDeleteItem(dataItem?.id)}
      //         />
      //       </div>
      //     </div>
      //   ))
      // }
      if (type === 6) {
        return (
          dataList.length > 0 &&
          dataList.map((dataItem) => (
            <div className={styles['banner-record-shop']}>
              <ImageBox wrapperStyle={{ marginRight: 8 }} height={40} width={40} src={dataItem?.logoUrl} />
              <Tooltip title={record?.name}>
                <span>{dataItem?.name}</span>
              </Tooltip>
              <div className={styles['banner-record-mask']}>
                <DeleteOutlined
                  className={styles['banner-record-mask-delete']}
                  onClick={() => _handleDeleteItem(dataItem?.id)}
                />
              </div>
            </div>
          ))
        )
      }
    }
  }, [type, dataList])

  const _onChooseConfirm = (record) => {
    switch (type) {
      case 1:
        changeProps({
          props: Object.assign(
            { ...props },
            {
              id: Array.isArray(id) ? [...id, ...record.map((item) => item.id)] : [...record.map((item) => item.id)],
              dataList: Array.isArray(dataList) ? [...dataList, ...record] : [...record],
            },
          ),
        })
        _onCommodityClose()
        break
      case 2:
        changeProps({
          props: Object.assign(
            { ...props },
            {
              id: record.id,
              dataList: record,
            },
          ),
        })
        _onActClose()
        break
      case 3:
      case 4:
      case 6:
        changeProps({
          props: Object.assign(
            { ...props },
            {
              id: Array.isArray(id) ? [...id, ...record.map((item) => item.id)] : [...record.map((item) => item.id)],
              dataList: Array.isArray(dataList) ? [...dataList, ...record] : [...record],
            },
          ),
        })
        _onShopClose()
        break
    }
  }

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>名称</div>
        <Input
          key={`${selectedKey}-name`}
          defaultValue={name}
          onBlur={(e) => _onChangeByKey(e.target.value, 'name', e.target.value)}
        />
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>类型</div>
        <Row gutter={20} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Select
              key={`${selectedKey}-type`}
              defaultValue={type}
              onChange={(value) => _onChangeByKey(value, 'type')}
              style={{ width: '100%' }}
            >
              {RedirectTypeList.map((selectItem) => (
                <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
                  {selectItem.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>橱窗广告图</div>
        {banner ? (
          <div className={styles['banner-box-icon']}>
            <ImageBox width="100%" height={96} src={banner} />
            <div className={styles['banner-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeByKey(url, 'banner')
                }}
                listType="text"
              >
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </UploadImage>
              <DeleteOutlined
                className={styles['banner-box-icon-cover-delete']}
                onClick={() => {
                  _onChangeByKey('', 'banner')
                }}
              />
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeByKey(url, 'banner')
            }}
            listType="text"
          >
            <div className={styles['banner-box-icon']}>
              <img src={uploadImgIcon} className={styles['banner-box-icon-add']} />
              <div className={styles['banner-box-icon-cover']}>
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>内页广告图</div>
        {inner ? (
          <div className={styles['banner-box-icon']}>
            {/* <img src={icon} /> */}
            <ImageBox width="100%" height={96} src={inner} />
            <div className={styles['banner-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeByKey(url, 'inner')
                }}
                listType="text"
              >
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </UploadImage>
              <DeleteOutlined
                className={styles['banner-box-icon-cover-delete']}
                onClick={() => {
                  _onChangeByKey('', 'inner')
                }}
              />
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeByKey(url, 'inner')
            }}
            listType="text"
          >
            <div className={styles['banner-box-icon']}>
              <img src={uploadImgIcon} className={styles['banner-box-icon-add']} />
              <div className={styles['banner-box-icon-cover']}>
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
      {_showByType}
      {_recordDetail}
      <MixDrawer
        onClose={_onShopClose}
        selectId={id}
        property={property}
        selectType="checkbox"
        type={type}
        shopId={shopId}
        onConfirm={_onChooseConfirm}
        visible={mixVisible}
        environment={environment}
      />
      <ActivityDrawer
        selectId={id}
        activityType={2}
        visible={actVisible}
        onClose={_onActClose}
        onConfirm={_onChooseConfirm}
      />
      <CommodityDrawer
        selectId={id}
        selectType="checkbox"
        visible={commodityVisible}
        onClose={_onCommodityClose}
        onConfirm={_onChooseConfirm}
      />
    </div>
  )
}

export default ShowCase
