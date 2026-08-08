import React, { useRef, useState, useEffect } from 'react'
import { Button, Card, Input, message, Modal, Radio, Row, Col, Tag, Spin, Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper, AuthButton } from '@apps/components'
import { REQUEST_HEADER } from '@apps/constants'
import { useSelfTable } from './model/useSelfTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import {
  getOrderBuyerDeliveryMiniAppCode,
  getOrderBuyerValidateDeliveryPage,
  getProductShopStoreGetCommodityDetail,
  getOrderVendorProductExport,
} from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import TableOperation from '@/components/TableOperation'
import { groupDetailByScan, ORDER_TYPE_POINTS } from '@/constants/order'
import SaleAfter from '../components/saleAfter'
import styles from './index.less'
import appImg from '@/assets/icons/app.png'
import miniappImg from '@/assets/icons/miniapp.png'
import scanImg from '@/assets/icons/scan.png'
import webImg from '@/assets/icons/web.png'
import { postMarketingWebActivityOrderOrderGroupPurchaseShareDetail } from '@apps/apis'
import cx from 'classnames'
import QRCode from 'qrcode'
import { tableListSchema } from './schema'
import { TOP_DOMAIN } from '@apps/constants'
import { getCommodityWebShopWebAll } from '@apps/apis'
import { getWebIntl } from '@apps/locales'
import { downFileByBuffer } from '@/utils/index'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

const translate = getWebIntl()
// 待发货订单

export interface ReadyDelevedOrderProps {}

/* 商城环境对应值 */
enum STORE_ENV_MAP {
  'WEB' = 1,
  'H5',
  'mini',
  'APP',
}

// 1.Web2.H53.小程序4.APP
const EnvironmentStore = {
  1: 'WEB',
  3: 'mini',
  4: 'APP',
}

const ReadyDelevedOrder: React.FC<ReadyDelevedOrderProps> = () => {
  const intl = useIntl()
  const { columns } = useSelfTable()
  const [saleVisible, setSaleVisible] = useState<boolean>(false)
  const [checkedId, setCheckedId] = useState<number>()
  const [recordId, setRecordId] = useState<any>()
  const [orderType, setOrderType] = useState<any>()
  const [webShareText, setWebShareText] = useState<string>()
  const [showDataSource, setShowDataSource] = useState([
    { id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) },
    { id: 2, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName2' }) },
    { id: 3, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName3' }) },
  ])
  const [shareVisible, setShareVisible] = useState<boolean>(false)
  const [payModel, setPayModel] = useState<number>()
  const currentOrderRef = useRef<any>({})
  const [qrCode, setQrCode] = useState('')
  const [activityInfo, setActivityInfo] = useState<any>()
  const [webGroupShareLink, setWebGroupShareLink] = useState<string>()
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })

  const fetchTableData = async (params) => {
    const { data } = await getOrderBuyerValidateDeliveryPage(params)
    return data
  }

  useEffect(() => {
    if (shareVisible) {
      if (payModel === STORE_ENV_MAP.WEB) {
        const link = `${REQUEST_HEADER}${activityInfo.shopPrefix}.${TOP_DOMAIN}/shop/${activityInfo.storeId}/group/detail/${activityInfo.productId}?groupId=${activityInfo.groupId}&skuId=${activityInfo.skuId}`
        setWebShareText(
          `${translate('web.resource.mall.yuanjia')}${translate('web.common.currencySymbol')}${
            activityInfo.price
          }，${translate('web.resource.mall.countrentuan', { count: activityInfo.assembleNum || 2 })} ，${translate(
            'web.resource.mall.zhixu',
          )}${translate('web.common.currencySymbol')}${activityInfo.activityPrice || 0}，${
            activityInfo?.productName
          } ${link}`,
        )
        setWebGroupShareLink(link)
      } else if (payModel === STORE_ENV_MAP.APP) {
        // 生成二维码
        QRCode.toDataURL(
          `${groupDetailByScan}?commodityId=${activityInfo.skuId}&teamId=${activityInfo.groupId}&shopId=${activityInfo.shopId}&shopType=${activityInfo.shopType}`,
        )
          .then((url: any) => {
            setQrCode(url)
          })
          .catch((err) => {
            console.error(err)
          })
      } else if (payModel === STORE_ENV_MAP['mini']) {
        getOrderBuyerDeliveryMiniAppCode({ orderId: currentOrderRef.current.orderId + '' }).then((res) => {
          setQrCode(res.data)
        })
      }
    }
  }, [payModel, shareVisible, currentOrderRef.current])

  const fetchShopWebAll = async (memberId, roleId) => {
    const params = {
      isMemberType: true,
      memberId,
      roleId,
    }

    try {
      const res = await getCommodityWebShopWebAll(params)
      if (res.code === 1000 && res.data && res.data.length > 0) {
        message.destroy()
        return res.data
      }
    } catch (error) {
      return []
    }
  }

  // 售后唤起弹窗
  const handleSaleAfter = ({ orderId, orderType }) => {
    setSaleVisible(true)
    setRecordId(orderId)
    setOrderType(orderType)
    if (orderType === ORDER_TYPE_POINTS) {
      setShowDataSource(() => [{ id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) }])
    } else {
      setShowDataSource(() => [
        { id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) },
        { id: 2, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName2' }) },
        { id: 3, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName3' }) },
      ])
    }
  }

  const handleOk = () => {
    if (checkedId) {
      switch (checkedId) {
        case 1:
          history.push(
            `/afterAbility/exchangeApplication/exchangePrSubmit/add?orderId=${recordId}&orderType=${orderType}`,
          )
          break
        case 2:
          history.push(`/afterAbility/returnApplication/returnPrSubmit/add?orderId=${recordId}&orderType=${orderType}`)
          break
        case 3:
          history.push(`/afterAbility/repairApplication/repairPrSubmit/add?orderId=${recordId}&orderType=${orderType}`)
          break
      }
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.error' }))
    }
  }

  const inviteParticipiteActivity = (record) => {
    // 根据接口数据，拼团活动信息和商品信息
    postMarketingWebActivityOrderOrderGroupPurchaseShareDetail({ id: record.orderId }, { ctlType: 'none' }).then(
      async (res) => {
        const { data } = res
        currentOrderRef.current = { ...record, timeStamp: new Date().getTime() }
        // 加入商城链接前缀 拼团id和商城id
        const shopList = await fetchShopWebAll(data.supplierMemberId, data.supplierRoleId)
        const shop = shopList.filter((item) => item.id === record.shopId)[0]
        const { data: commodityDetail } = await getProductShopStoreGetCommodityDetail(
          { commodityId: String(data.productId) },
          { headers: { shopId: record.shopId } },
        )
        if (shop && commodityDetail) {
          setActivityInfo({
            ...data,
            shopPrefix: shop.url,
            groupId: record.groupId,
            shopId: record.shopId,
            storeId: commodityDetail.storeId,
            shopType: shop.type,
          })
          setPayModel(data.environmentList[0])
        } else {
          message.error(intl.formatMessage({ id: 'agentOrder.mall.isNotExist' }))
        }
      },
    )
    setShareVisible(true)
  }
  /** 参照后台数据生成 */
  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [intl.formatMessage({ id: 'purchaseOrder.operation2' })]: record.showAfterSales,
      [intl.formatMessage({ id: 'purchaseOrder.operation5' })]: record.showInvite,
    }

    const operationHandler = {
      [intl.formatMessage({ id: 'purchaseOrder.operation2' })]: () => handleSaleAfter(record),
      [intl.formatMessage({ id: 'purchaseOrder.operation5' })]: () => inviteParticipiteActivity(record),
    }

    const buttonPermissionsMap = {
      [intl.formatMessage({ id: 'purchaseOrder.operation2' })]: 'after',
      [intl.formatMessage({ id: 'purchaseOrder.operation5' })]: 'invite',
    }

    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={buttonPermissionsMap}
      />
    )
  }
  const secondColumns = () => {
    if (columns) {
      return columns.concat([
        {
          title: intl.formatMessage({ id: 'purchaseOrder.operation' }),
          width: 160,
          dataIndex: 'ctl',
          key: 'ctl',
          fixed: 'right',
          render: (text, record) => renderOptionButton(record),
        },
      ])
    }
  }

  const onChangePayModel = (e) => {
    setPayModel(Number(e.target.value))
  }

  const onSave = () => {
    const img: any = document.getElementById('qrcodeElement')
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height)
    const url = canvas.toDataURL('image/png')
    const downloadLink = document.getElementById('downloadLink')
    downloadLink.setAttribute('href', url)

    downloadLink.setAttribute(
      'download',
      `${intl.formatMessage({ id: 'saleOrder.daochuerweima', defaultMessage: '导出二维码' })}.png`,
    )
    downloadLink.click()
  }

  const copyHandle = (content) => {
    const copy = (e) => {
      e.preventDefault()
      e.clipboardData.setData('text/plain', content)
      message.success(intl.formatMessage({ id: 'saleOrder.fuzhichenggong', defaultMessage: '复制成功' }))
      document.removeEventListener('copy', copy)
    }
    document.addEventListener('copy', copy)
    document.execCommand('Copy')
  }

  const handleCopy = () => {
    copyHandle(webGroupShareLink)
  }

  const handleExport = async () => {
    if (rowSelectionCtl.selectRow.length === 0) {
      return message.error(
        intl.formatMessage({ id: 'purchaseOrder.qingxiangouxuanding', defaultMessage: '请先勾选订单' }),
      )
    }
    const p = { orderIdList: rowSelectionCtl.selectRow.map((i) => i.orderId), orderOuterStatus: 11 }
    getOrderVendorProductExport(p, { responseType: 'blob', getResponse: true }).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const suffixName = response.headers.get('content-disposition').split('.')[1]
        // 导出日期
        const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const fileName = `${currentDate}_订单商品清单.${suffixName}`
        downFileByBuffer(response.data, fileName)
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={secondColumns()}
          tableProps={{ rowKey: 'orderNo', scroll: { x: '100%' } }}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema(),
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
          }}
        />
      </Card>
      <SaleAfter
        visible={saleVisible}
        showDataSource={showDataSource}
        currentSelectedKey={checkedId}
        onOk={handleOk}
        onCancel={() => setSaleVisible(false)}
        onClickItem={(id) => setCheckedId(id)}
      />
      <Modal
        title={intl.formatMessage({
          id: 'saleOrder.shengchengfenxainglianjie',
          defaultMessage: '生成分享链接',
        })}
        visible={shareVisible}
        onCancel={() => setShareVisible(false)}
        footer={false}
        width={600}
        destroyOnClose={true}
        afterClose={() => setQrCode('')}
      >
        <div>
          <div style={{ marginBottom: 10 }}>
            <p>{intl.formatMessage({ id: 'saleOrder.xuanzeleixin', defaultMessage: '选择类型：' })}</p>
            <Radio.Group onChange={onChangePayModel} value={payModel}>
              {activityInfo?.environmentList.map(
                (item) =>
                  Object.keys(EnvironmentStore).includes(item + '') && (
                    <Radio key={item} value={item}>
                      {EnvironmentStore[item] === 'mini' ? translate('web.common.xiaochengxu') : EnvironmentStore[item]}
                    </Radio>
                  ),
              )}
            </Radio.Group>
            <p style={{ marginTop: 24 }}>
              <span className={styles.listLabel}>
                {payModel === STORE_ENV_MAP.WEB
                  ? intl.formatMessage({
                      id: 'saleOrder.fenxiangpintuanlianjie',
                      defaultMessage: '分享拼团链接',
                    })
                  : payModel === STORE_ENV_MAP.APP
                  ? intl.formatMessage({ id: 'saleOrder.apperweima', defaultMessage: 'APP二维码' })
                  : intl.formatMessage({
                      id: 'saleOrder.xiaochengxuerweima',
                      defaultMessage: '小程序二维码',
                    })}
              </span>
            </p>
          </div>
          {payModel === STORE_ENV_MAP.WEB && (
            <div className={styles.appPayContainer}>
              <div className={cx(styles.appPayContent, styles.appPayContentLink)}>
                <div className={styles.appPayTitle}>
                  <img src={webImg} alt="" width={32} height={32} />
                  <h2>{intl.formatMessage({ id: 'saleOrder.webLink', defaultMessage: '拼团链接' })}</h2>
                </div>
                <div className={styles.appPayMain}>
                  <p>
                    <Input.TextArea
                      id="linkInput"
                      style={{ wordBreak: 'break-all' }}
                      value={webShareText}
                      rows={3}
                      disabled
                    />
                  </p>
                </div>
              </div>
              <p>
                <Button className={styles.bottomBtn} type="primary" onClick={handleCopy}>
                  {intl.formatMessage({ id: 'saleOrder.fuzhilianjie', defaultMessage: '复制链接' })}
                </Button>
              </p>
            </div>
          )}
          {payModel === STORE_ENV_MAP.APP && (
            <div className={styles.appPayContainer}>
              <div className={styles.appPayContent}>
                <div className={styles.appPayTitle}>
                  <img src={appImg} alt="" width={32} height={32} />
                  <h2>{intl.formatMessage({ id: 'saleOrder.APPsaoma', defaultMessage: 'APP扫码' })}</h2>
                </div>
                <div className={styles.appPayMain}>
                  <Row>
                    <Col span={16}>
                      <div className={styles.appPayCommodity}>
                        <div className={styles.commodityImage}>
                          <img
                            src={activityInfo?.productImgUrl}
                            alt={activityInfo?.productName}
                            width={88}
                            height={88}
                          />
                        </div>
                        <div className={styles.commodityDescription}>
                          <p>
                            <Tag color="red">{activityInfo?.assembleNum}人团</Tag>
                            <span>{activityInfo?.productName}</span>
                          </p>
                          <p className={styles.commodityPrice}>
                            <span>{translate('web.common.currencySymbol')}</span>
                            {Number(activityInfo?.activityPrice).toFixed(2)}
                            <span className={styles.originPrice}>{Number(activityInfo?.price).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.appPayQrCode}>
                        <div>
                          {qrCode ? <img id="qrcodeElement" src={qrCode} alt="" width={130} height={130} /> : <Spin />}
                        </div>
                        <p>
                          <img src={scanImg} alt="" width={16} height={16} />
                          {intl.formatMessage({
                            id: 'saleOrder.saomacanyupintuan',
                            defaultMessage: '扫码参与拼团',
                          })}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <p>
                <Button type="primary" onClick={onSave}>
                  {intl.formatMessage({ id: 'saleOrder.baocuntupian', defaultMessage: '保存图片' })}
                </Button>
              </p>
            </div>
          )}
          {payModel === STORE_ENV_MAP['mini'] && (
            <div className={styles.appPayContainer}>
              <div className={styles.appPayContent}>
                <div className={styles.appPayTitle}>
                  <img src={miniappImg} alt="" width={32} height={32} />
                  <h2>
                    {intl.formatMessage({
                      id: 'saleOrder.xiaochengxusaoma',
                      defaultMessage: '小程序扫码',
                    })}
                  </h2>
                </div>
                <div className={styles.appPayMain}>
                  <Row>
                    <Col span={16}>
                      <div className={styles.appPayCommodity}>
                        <div className={styles.commodityImage}>
                          <img
                            src={activityInfo?.productImgUrl}
                            alt={activityInfo?.productName}
                            width={88}
                            height={88}
                          />
                        </div>
                        <div className={styles.commodityDescription}>
                          <p>
                            <Tag color="red">{activityInfo?.assembleNum}人团</Tag>
                            <span>{activityInfo?.productName}</span>
                          </p>
                          <p className={styles.commodityPrice}>
                            <span>{translate('web.common.currencySymbol')}</span>
                            {Number(activityInfo?.activityPrice).toFixed(2)}
                            <span className={styles.originPrice}>{Number(activityInfo?.price).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.appPayQrCode}>
                        <div>
                          {qrCode ? <img id="qrcodeElement" src={qrCode} alt="" width={130} height={130} /> : <Spin />}
                        </div>
                        <p>
                          <img src={scanImg} alt="" width={16} height={16} />
                          {intl.formatMessage({
                            id: 'saleOrder.saomacanyupintuan',
                            defaultMessage: '扫码参与拼团',
                          })}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <p>
                <Button type="primary" onClick={onSave}>
                  {intl.formatMessage({ id: 'saleOrder.baocuntupian', defaultMessage: '保存图片' })}
                </Button>
              </p>
            </div>
          )}
        </div>
      </Modal>
      <a href="" id="downloadLink" style={{ visibility: 'hidden', display: 'none' }} />
    </PageHeaderWrapper>
  )
}

ReadyDelevedOrder.defaultProps = {}

export default ReadyDelevedOrder
