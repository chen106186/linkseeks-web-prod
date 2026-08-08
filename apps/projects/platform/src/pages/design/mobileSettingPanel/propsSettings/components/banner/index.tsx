import React, { useMemo, useState, useEffect } from 'react'
import { Input, Select, Row, Col, Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { changeProps } from '@apps/design-core'
import { useIntl } from '@linkseeks/i18n'
import { LAYOUT_TYPE } from '@/constants'
import { UploadImage } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { priceFormat } from '@/utils/numberFomat'

import { getProductCommodityGetCommodity } from '@apps/apis'
import { getMarketingWebActivityPageGet, getCommodityWebStoreWebFindById } from '@apps/apis'
import { getManageContentInformationListAdorn } from '@apps/apis'

import MixDrawer from '@/pages/design/components/drawer/mixDrawer'
import ActivityDrawer from '@/pages/design/components/drawer/activityDrawer'
import CommodityDrawer from '@/pages/design/components/drawer/commodityDrawer'

import uploadImgIcon from '@/assets/icons/upload_img_icon.svg'
import ActivityImage from '@/assets/couponIcons/ActivityImage.svg'
import { authService } from '@apps/services'

import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
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
  layoutType: LAYOUT_TYPE
  environment: number
}

const RedirectTypeList = [
  {
    value: 1,
    label: translate('web.resource.shop.shangpinxiangqing'),
  },
  {
    value: 2,
    label: translate('web.resource.shop.huodongzhuye'),
  },
  {
    value: 3,
    label: translate('web.resource.shop.jifenxiangqing'),
  },
  {
    value: 4,
    label: translate('web.resource.shop.butiaozhuan'),
  },
]

const RedirectTypeList_Channel = [
  {
    value: 1,
    label: translate('web.resource.shop.shangpinxiangqing'),
  },
  {
    value: 2,
    label: translate('web.resource.shop.huodongzhuye'),
  },
  {
    value: 3,
    label: translate('web.resource.shop.jifenxiangqing'),
  },
  {
    value: 5,
    label: translate('web.resource.shop.zixunxiangqing'),
  },
  {
    value: 4,
    label: translate('web.resource.shop.butiaozhuan'),
  },
]

const BannerClient: React.FC<BannerClientProps> = (props: BannerClientProps) => {
  const { name, img, id, type, property = 2, selectedKey, environment, layoutType } = props
  const [mixVisible, setMixVisible] = useState<boolean>(false)
  const [actVisible, setActVisible] = useState<boolean>(false)
  const [commodityVisible, setCommodityVisible] = useState<boolean>(false)
  const [record, setRecord] = useState<any>()
  const { memberId, memberRoleId } = authService.getAuth() || {}
  const intl = useIntl()

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
    return async () => {}
  }, [type])

  const _isNull = (list) => {
    let _number = 0
    for (let key in list) {
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
          break
        default:
          setRecord('')
          break
      }
    }
  }, [_fetch, id, type, property])

  const _selectOption = useMemo(() => {
    if (layoutType === LAYOUT_TYPE.shop) {
      return RedirectTypeList
    }
    if (layoutType === LAYOUT_TYPE.channel || layoutType === LAYOUT_TYPE.own) {
      return RedirectTypeList_Channel
    }
    return []
  }, [layoutType])

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
                  {record?.min ? `${translate('web.common.currencySymbol')}${priceFormat(record?.min)}` : ''}
                </div>
              </div>
            </div>
            {record?.activityList?.length > 0 && (
              <div className={styles['banner-record-commodity-box']}>
                <div className={styles['banner-record-commodity-label']}>
                  {intl.formatMessage({ id: 'editor.setting.product.activity' })}
                </div>
                {record?.activityList?.map((item) => {
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
        )
      }
      if (type === 2) {
        return (
          <div className={styles['banner-record-activity']}>
            <img src={record?.templatePicUrl} />
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
                title={
                  record?.type === 1
                    ? intl.formatMessage({ id: 'common.text.platform' })
                    : intl.formatMessage({ id: 'common.text.business' })
                }
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
            <Tooltip title={record?.memberName}>
              <span>{record?.memberName}</span>
            </Tooltip>
          </div>
        )
      }
      if (type === 5) {
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
    if (!type || type === 4) {
      return false
    }
    return true
  }, [type])

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
        <div className={styles['banner-box-label']}>{intl.formatMessage({ id: 'editor.setting.form.name' })}</div>
        <Input key={`${selectedKey}-name`} defaultValue={name} onBlur={_onChangeName} />
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>{intl.formatMessage({ id: 'editor.setting.form.picUrl' })}</div>
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
                <div className={styles['banner-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
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
                <div className={styles['banner-box-icon-cover-bottom']}>
                  {intl.formatMessage({ id: 'editor.setting.upload.btn' })}
                </div>
              </div>
            </div>
          </UploadImage>
        )}
      </div>
      <div className={styles['banner-box']}>
        <div className={styles['banner-box-label']}>{intl.formatMessage({ id: 'editor.setting.form.jumplink' })}</div>
        <Row gutter={20} style={{ marginBottom: 16 }}>
          <Col span={_showChoose ? 18 : 24}>
            <Select key={`${selectedKey}-type`} defaultValue={type} onChange={_onChangeType} style={{ width: '100%' }}>
              {_selectOption.map((selectItem) => (
                <Select.Option value={selectItem.value} key={`redirect_type_${selectItem.value}`}>
                  {selectItem.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          {_showChoose && (
            <Col span={6}>
              <Button block onClick={_onChoose}>
                {intl.formatMessage({ id: 'common.button.select' })}
              </Button>
            </Col>
          )}
        </Row>
        {_recordDetail}
      </div>
      <MixDrawer
        selectId={id}
        layoutType={layoutType}
        onClose={_onMixClose}
        property={property}
        type={type}
        onConfirm={_onChooseConfirm}
        visible={mixVisible}
        filterParam={{
          memberId,
          memberRoleId,
        }}
        environment={environment}
      />
      <ActivityDrawer selectId={id} visible={actVisible} onClose={_onActClose} onConfirm={_onChooseConfirm} />
      <CommodityDrawer
        layoutType={layoutType}
        selectId={id}
        visible={commodityVisible}
        onClose={_onCommodityClose}
        onConfirm={_onChooseConfirm}
        filterParam={{
          memberId,
          memberRoleId,
        }}
      />
    </div>
  )
}

export default BannerClient
