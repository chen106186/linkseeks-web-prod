import React, { useMemo, useState, useEffect } from 'react'
import { Input, Select, Row, Col, Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'

import styles from './index.less'

import { getProductCommodityGetCommodity } from '@apps/apis'
import { getManageContentInformationListAdorn } from '@apps/apis'
import { getMarketingWebActivityPageGet, getCommodityWebStoreWebFindById } from '@apps/apis'
import { UploadImage } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { priceFormat } from '@/utils/numberFomat'

import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import ActivityDrawer from '@/pages/pageCustomized/components/drawers/activityDrawer'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'

import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'
import ActivityImage from '@/assets/activity/ActivityImage.svg'

interface BannerClientProps {
  // 名称
  name?: string
  // 图片
  img?: any
  // 跳转类型
  type?: any
  // 跳转类型的id
  id?: any
  // 当前选中组件的key
  selectedKey?: any
  // 1.B端 2.C端 3.SRM
  property?: 1 | 2 | 3
  environment: number
}

const RedirectTypeListC = [
  {
    value: 1,
    label: '商品详情',
  },
  {
    value: 2,
    label: '活动主页',
  },
  {
    value: 3,
    label: '积分详情',
  },
  {
    value: 4,
    label: '店铺主页',
  },
  {
    value: 5,
    label: '不跳转',
  },
]

const RedirectTypeListB = [
  {
    value: 1,
    label: '商品详情',
  },
  {
    value: 2,
    label: '活动主页',
  },
  {
    value: 3,
    label: '积分详情',
  },
  {
    value: 4,
    label: '店铺主页',
  },
  {
    value: 5,
    label: '资讯详情',
  },
  {
    value: 6,
    label: '不跳转',
  },
  {
    value: 7,
    label: '社区团购',
  },
]

const BannerClient: React.FC<BannerClientProps> = (props: BannerClientProps) => {
  const { name, img, id, type, property = 2, selectedKey, environment } = props
  const [mixVisible, setMixVisible] = useState<boolean>(false)
  const [actVisible, setActVisible] = useState<boolean>(false)
  const [commodityVisible, setCommodityVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>()

  const _fetch: any = useMemo(() => {
    switch (type) {
      case 1:
      case 3:
        return getProductCommodityGetCommodity
      case 2:
        return getMarketingWebActivityPageGet
      case 4:
        return getCommodityWebStoreWebFindById
      case 5:
        return getManageContentInformationListAdorn
    }
    return async () => {
      console.log('none')
    }
  }, [type])

  const _isNull = (list) => {
    let _number = 0
    for (const key in list) {
      if (list[key]) {
        _number += 1
      }
    }
    return _number === list.length ? false : true
  }

  useEffect(() => {
    if (!id) {
      setRecord('')
    } else {
      switch (type) {
        case 1:
        case 2:
        case 3:
        case 4:
          id &&
            _fetch?.({ id: id })
              .then((res) => {
                if (res.code === 1000) {
                  setRecord(res.data)
                } else {
                  setRecord('')
                }
              })
              .catch((_) => setRecord(''))
          break
        case 5:
          if (property === 1) {
            id &&
              _fetch?.({ idInList: id, current: 1, pageSize: 1 })
                .then((res) => {
                  if (res.code === 1000) {
                    setRecord(res.data.data[0])
                  } else {
                    setRecord('')
                  }
                })
                .catch((_) => setRecord(''))
          }
          break
        default:
          setRecord('')
          break
      }
    }
  }, [_fetch, id, type, property])

  const _selectOption = useMemo(() => {
    if (property === 1) {
      return RedirectTypeListB
    }
    if (property === 2) {
      return RedirectTypeListC
    }
  }, [property])

  const _recordDetail = useMemo(() => {
    if (record) {
      if (type === 1) {
        return (
          <>
            <div className={styles['banner-record-commodity-detail']}>
              <img src={record?.mainPic} />
              <div className={styles['banner-record-commodity-detail-right']}>
                <Tooltip title={record?.name}>
                  <div className={styles['banner-record-commodity-detail-right-title']}>{record?.name}</div>
                </Tooltip>
                <div className={styles['banner-record-commodity-detail-right-price']}>
                  {record?.min ? `¥ ${priceFormat(record?.min)}` : ''}
                </div>
              </div>
            </div>
            {record?.activityList?.length && (
              <div className={styles['banner-record-commodity-box']}>
                <div className={styles['banner-record-commodity-label']}>商品活动</div>
                {record?.activityList?.map((item, index) => {
                  return (
                    <div key={item?.id ?? index} className={styles['banner-record-commodity-activityList']}>
                      <img src={ActivityImage} />
                      <div className={styles['banner-record-commodity-activityList-name']}>{item.name}</div>
                      <StatusTag title={item.type} type="danger" />
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )
      }
      if (type === 2) {
        return (
          <div className={styles['banner-record-activity']}>
            <div className={styles['banner-record-activity-right']}>
              <Tooltip title={record?.name}>
                <div className={styles['banner-record-activity-right-top']}>{record?.name}</div>
              </Tooltip>
              {record?.type === 2 && (
                <div className={styles['banner-record-activity-right-bottom']}>{record?.memberName}</div>
              )}
            </div>
            <div className={styles['banner-record-activity-tag']}>
              <StatusTag
                title={record?.type === 1 ? '平台' : '商家'}
                type={record?.type === 1 ? 'success' : 'primary'}
              />
            </div>
          </div>
        )
      }
      if (type === 3) {
        return (
          <div className={styles['banner-record-integral']}>
            <img src={record?.mainPic} />
            <div className={styles['banner-record-integral-right']}>
              <Tooltip title={record?.name}>
                <div className={styles['banner-record-integral-right-top']}>{record?.name}</div>
              </Tooltip>
              <div className={styles['banner-record-integral-right-bottom']}>{priceFormat(record?.min)} 积分</div>
            </div>
          </div>
        )
      }
      if (type === 4) {
        return (
          <div className={styles['banner-record-shop']}>
            <img src={record?.logo} />
            <Tooltip title={record?.name || record?.memberName}>
              <span>{record?.name || record?.memberName}</span>
            </Tooltip>
          </div>
        )
      }
      if (property === 1 && type === 5) {
        return (
          <div className={styles['banner-record-activity']}>
            <img src={record?.imageUrl} />
            <div className={styles['banner-record-activity-right']}>
              <Tooltip title={record?.title}>
                <div className={styles['banner-record-activity-right-top']}>{record?.title}</div>
              </Tooltip>
              <div style={{ display: 'inline-block' }}>
                <StatusTag title={record?.columnName} type={'primary'} />
              </div>
            </div>
          </div>
        )
      }
    }
  }, [type, record, property])

  const _showChoose = useMemo(() => {
    if ((property === 1 && type === 6) || type === 7) {
      return false
    }
    if (property === 2 && type === 5) {
      return false
    }
    if (!type) {
      return false
    }
    return true
  }, [type, property])

  const _onChangeName = (e: any) => {
    const _val = e.target.value
    changeProps({
      title: _val || '',
      props: Object.assign({ ...props }, { name: _val, isnull: _isNull([img, type]) }),
    })
  }

  const _onChangeType = (value: any) => {
    changeProps({
      props: Object.assign({ ...props }, { type: value, id: '', isnull: _isNull([img, value]) }),
    })
  }

  const _onChangeImg = (url: any) => {
    changeProps({
      props: Object.assign({ ...props }, { img: url, isnull: _isNull([url, type]) }),
    })
  }

  const _onMixClose = () => {
    setMixVisible(false)
  }

  const _onActClose = () => {
    setActVisible(false)
  }

  const _onCommodityClose = () => {
    setCommodityVisible(false)
  }

  const _onChoose = () => {
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
        setMixVisible(true)
        break
    }
  }

  const _onChooseConfirm = (record) => {
    setRecord(record)
    changeProps({
      props: Object.assign({ ...props }, { id: record.id, isnull: _isNull([name, img, type]) }),
    })
    switch (type) {
      case 1:
        _onCommodityClose()
        break
      case 2:
        _onActClose()
        break
      case 3:
      case 4:
      case 5:
        _onMixClose()
        break
    }
  }

  return (
    <div className={styles['banner']}>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>名称</div>
        <Input key={`${selectedKey}-name`} defaultValue={name} onBlur={_onChangeName} />
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>图片</div>
        {img ? (
          <div className={styles['banner-box-icon']}>
            <img src={img} />
            <div className={styles['banner-box-icon-cover']}>
              <UploadImage
                onChange={(url) => {
                  _onChangeImg(url)
                }}
                listType="text"
              >
                <div className={styles['banner-box-icon-cover-bottom']}>添加图像</div>
              </UploadImage>
              <DeleteOutlined
                className={styles['banner-box-icon-cover-delete']}
                onClick={() => {
                  _onChangeImg('')
                }}
              />
            </div>
          </div>
        ) : (
          <UploadImage
            onChange={(url) => {
              _onChangeImg(url)
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
        <div className={styles['banner-box-label']}>跳转链接</div>
        <Row gutter={20} style={{ marginBottom: 16 }}>
          <Col span={18}>
            <Select key={`${selectedKey}-type`} defaultValue={type} onChange={_onChangeType} style={{ width: '100%' }}>
              {_selectOption?.map((selectItem) => (
                <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
                  {selectItem.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          {_showChoose && (
            <Col span={6}>
              <Button block onClick={_onChoose}>
                选择
              </Button>
            </Col>
          )}
        </Row>
        {_recordDetail}
      </div>
      <MixDrawer
        selectId={id}
        onClose={_onMixClose}
        property={property}
        type={type}
        onConfirm={_onChooseConfirm}
        visible={mixVisible}
        environment={environment}
      />
      <ActivityDrawer selectId={id} visible={actVisible} onClose={_onActClose} onConfirm={_onChooseConfirm} />
      <CommodityDrawer
        selectId={id}
        visible={commodityVisible}
        onClose={_onCommodityClose}
        onConfirm={_onChooseConfirm}
      />
    </div>
  )
}

export default BannerClient
