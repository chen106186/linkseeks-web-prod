import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { message, Modal, Radio } from 'antd'
import cx from 'classnames'
import IconFont from '@/utils/iconfont'
import Clipboard from 'copy-to-clipboard'
import { TagItem } from '@/components/ActivityTags'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import {
  postMarketingWebActivityOrderGroupPurchaseList,
  PostMarketingWebActivityOrderGroupPurchaseListResponseDetail,
  postMarketingWebActivityOrderGroupPurchaseDetail,
  PostMarketingWebActivityOrderGroupPurchaseDetailResponse,
  postMarketingWebActivityOrderOrderGroupPurchaseShareDetail,
  PostMarketingWebActivityOrderOrderGroupPurchaseShareDetailResponse,
  getCommodityMobileShopMobileShopSelect,
} from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import { getWebIntl } from '@/utils/locales'
import { LinkTo, replaceNameString } from '@/utils'
import { MallInfoType, UserInfoType } from '@/types/global'
import appShareIcon from './icons/scan_app_icon.png'
import miniShareIcon from './icons/scan_mini_icon.png'
import { ProductInfoType } from '../../types'
import styles from './index.module.less'
import { useGlobalConext } from '@/context/globalProvider'
import ImageBox from '@apps/components/src/web/ImageBox'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { validateLoginWrapper } from '@/utils/validateLogin'
import useLink from '@/hooks/useLink'

type GroupBuyItemType = PostMarketingWebActivityOrderGroupPurchaseListResponseDetail & { endTimeText: string }

interface GroupBuyProps {
  /** 商品详情信息 */
  productInfo: ProductInfoType

  skuId: number | undefined
  /** 活动价 */
  activityPrice: number
  /** 原价 */
  originalPrice: number
}

type ShareType = 'web' | 'app' | 'mini' | 'h5'

const GroupBuy: React.FC<GroupBuyProps> = (props) => {
  const { productInfo, skuId, activityPrice, originalPrice } = props
  const { mallInfo, userInfo, mallList, url } = useGlobalConext()
  const timer = useRef<any>()
  const [groupList, setGroupList] = useState<GroupBuyItemType[]>([])
  const [joinModalVisible, setJoinModalVisible] = useState<boolean>(false)
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false)
  const [shareType, setShareType] = useState<ShareType>('web')
  const [appShareCodeImg, setAppShareCodeImg] = useState<string>()
  const [miniShareCodeImg, setMiniShareCodeImg] = useState<string>()
  const [currentGroupInfo, setCurrentGroupInfo] = useState<GroupBuyItemType>()
  const [currentGroupDetail, setCurrentGroupDetail] =
    useState<PostMarketingWebActivityOrderGroupPurchaseDetailResponse>()
  const [shareDetail, setShareDetail] = useState<PostMarketingWebActivityOrderOrderGroupPurchaseShareDetailResponse>()
  const PAGE_SIZE = 20
  const translate = getWebIntl()
  const appShareRef = useRef<any>()
  const miniShareRef = useRef<any>()
  const { linkPrefix } = useLink()

  const getGroupDetail = (groupId: number) => {
    postMarketingWebActivityOrderGroupPurchaseDetail({ id: groupId }, { ctlType: 'none' }).then((res) => {
      message.destroy()
      if (res.code === 1000 && res.data) {
        setCurrentGroupDetail(res.data)
      }
    })
  }

  const getShareDetail = (id: number) => {
    postMarketingWebActivityOrderOrderGroupPurchaseShareDetail({ id }, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000 && res.data) {
        setShareDetail(res.data)
      }
    })
  }

  const getGroupBuyList = () => {
    const param: any = {
      productId: productInfo.id,
      current: 1,
      pageSize: PAGE_SIZE,
    }
    postMarketingWebActivityOrderGroupPurchaseList(param, { ctlType: 'none' }).then((res) => {
      message.destroy()
      if (res.code === 1000 && res.data) {
        groupCountTime(res.data.data as GroupBuyItemType[])
      }
    })
  }

  useEffect(() => {
    if (productInfo) {
      getGroupBuyList()
    }
  }, [productInfo])

  const replenishZero = (count: number) => {
    if (count < 10) {
      return `0${count}`
    }
    return count
  }

  const countDownTime = (endTime: number) => {
    const nowTime = new Date().getTime()

    const lefttime = endTime - nowTime // 距离结束时间的毫秒数
    if (lefttime > 0) {
      const leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)) // 计算天数
      const lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24) + leftd * 24 // 计算小时数
      const leftm = Math.floor((lefttime / (1000 * 60)) % 60) // 计算分钟数
      const lefts = Math.floor((lefttime / 1000) % 60) // 计算秒数
      return '剩余' + replenishZero(lefth) + ':' + replenishZero(leftm) + ':' + replenishZero(lefts) // 返回倒计时的字符串
    } else {
      return '已结束'
    }
  }

  const groupCountTime = (groupList: GroupBuyItemType[]) => {
    timer.current = setInterval(() => {
      setGroupList(() => {
        return groupList.map((item) => {
          return {
            ...item,
            endTimeText: countDownTime(item.endTime),
          }
        })
      })
    }, 1000)
  }

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = undefined
    }
  }

  /**
   * 生成二维码
   * @param path
   */
  const generateQrCode = (path: any, type: ShareType) => {
    QRCode.toDataURL(path)
      .then((url: any) => {
        if (type === 'app') {
          setAppShareCodeImg(url)
        } else if (type === 'mini') {
          setMiniShareCodeImg(url)
        }
      })
      .catch((err: any) => {
        console.error(err)
      })
  }

  const getDefaultMallIdByType = async (type: 'app' | 'mini') => {
    const res = await getCommodityMobileShopMobileShopSelect({ environment: type === 'app' ? 4 : 3 } as any)
    if (res.code === 1000 && res.data && res.data.shopSelectList.length > 0) {
      return res.data.shopSelectList[0].id
    }
    return undefined
  }

  /** 获取app分享拼团二维码 */
  const getAppShareImg = (groupId: number) => {
    const shareLink = `${process.env.GROUP_BUY_H5}?commodityId=${
      productInfo.id
    }&skuId=${skuId}&teamId=${groupId}&shopId=${getDefaultMallIdByType('app')}&shopType=${1}`
    generateQrCode(shareLink, 'app')
  }

  /** 获取微信小程序分享拼团二维码 */
  const getMiniShareImg = (groupId: number) => {
    const shareLink = `${process.env.GROUP_BUY_H5}?commodityId=${
      productInfo.id
    }&skuId=${skuId}&teamId=${groupId}&shopId=${getDefaultMallIdByType('mini')}&shopType=${1}`
    generateQrCode(shareLink, 'mini')
  }

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [])

  const checkoutUserInfo: any = validateLoginWrapper(() => {
    if (userInfo?.memberRoleType !== 2) {
      message.info(translate('web.resource.mall.currentRole'))
      return false
    }
    if (userInfo?.memberId === productInfo?.memberId) {
      message.info(translate('web.resource.mall.bunenggoumaizijideshangpin'))
      return false
    }
    return true
  })

  const renderCountTime = useMemo(() => {
    return (
      groupList &&
      groupList.map((item, index) => (
        <div className={styles.group_list_item} key={`gourp_item_${index}`}>
          <ImageBox width={32} height={32} round={16} src={item.logo || '/default_logo.png'} />
          <span className={styles.group_master_name}>{replaceNameString(item.memberName)}</span>
          <div className={styles.group_remaining_time}>{item.endTimeText}</div>
          <div className={styles.group_remaining_people}>
            {translate('web.resource.mall.haichanumpincheng', {
              num: item.num,
            })}
          </div>
          {item.inviteButton ? (
            <div
              className={cx(styles.group_btn, styles.share)}
              onClick={validateLoginWrapper(() => {
                getShareDetail(item.orderId)
                getGroupDetail(item.id)
                getAppShareImg(item.id)
                getMiniShareImg(item.id)
                setCurrentGroupInfo(item)
                setShareModalVisible(true)
              })}
            >
              {translate('web.resource.mall.yaoqinghaoyou')}
            </div>
          ) : (
            <div
              className={cx(styles.group_btn)}
              onClick={() => {
                if (checkoutUserInfo()) {
                  getGroupDetail(item.id)
                  setCurrentGroupInfo(item)
                  setJoinModalVisible(true)
                }
              }}
            >
              {translate('web.resource.mall.lijicantuan')}
            </div>
          )}
        </div>
      ))
    )
  }, [groupList])

  const handleShareTypeChange = (e: any) => {
    setShareType(e.target.value)
  }

  const webShareLink = useMemo(() => {
    if (currentGroupDetail) {
      const groupDetailLink = `${REQUEST_HEADER}${mallInfo?.url}.${TOP_DOMAIN}/shop/${productInfo.storeId}/group/detail/${productInfo.id}?groupId=${currentGroupInfo?.id}&skuId=${skuId}`
      return `${translate('web.resource.mall.yuanjia')}${translate('web.common.currencySymbol')}${
        originalPrice || 0
      }，${translate('web.resource.mall.countrentuan', { count: currentGroupDetail?.assembleNum || 2 })} ，${translate(
        'web.resource.mall.zhixu',
      )}${translate('web.common.currencySymbol')}${activityPrice || 0}，${productInfo?.name} ${groupDetailLink}`
    }
    return ''
  }, [currentGroupDetail, productInfo])

  const handleCopyShareLink = () => {
    const shareLink = `${REQUEST_HEADER}${mallInfo?.url}.${TOP_DOMAIN}/shop/${productInfo.storeId}/group/detail/${productInfo.id}?groupId=${currentGroupInfo?.id}&skuId=${skuId}`
    if (Clipboard(shareLink)) {
      message.success(translate('web.common.fuzhichenggong'))
    }
  }

  const createAndSaveImg = (targe: any) => {
    html2canvas(targe, {
      useCORS: true,
      // proxy?: string;
    }).then((canvas) => {
      const imgUrl = canvas.toDataURL()
      let link = document.createElement('a')
      link.href = imgUrl
      link.setAttribute('download', `scan_share_${new Date().getTime()}.png`)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
    })
  }

  const renderShareType = useMemo(() => {
    switch (shareType) {
      case 'web':
        return (
          <div className={styles.shareModal_share_item} style={{ padding: 24 }}>
            <div className={styles.shareModal_share_item_title}>
              <IconFont type="icon-group_share_web" className={styles.share_type_icon} />
              <span>{translate('web.resource.mall.pintuanlianjie')}</span>
            </div>
            <div className={styles.shareModal_sharelink}>
              <span>{webShareLink}</span>
            </div>
            <div className={styles.shareModal_btn} onClick={() => handleCopyShareLink()}>
              {translate('web.resource.mall.fuzhilianjie')}
            </div>
          </div>
        )
      case 'app':
        return (
          <div className={styles.shareModal_share_item} id="appShare">
            <div className={styles.shareModal_share_item_body} ref={appShareRef}>
              <div className={styles.shareModal_share_item_title}>
                <img src={appShareIcon} className={styles.share_type_icon} />
                <span>{translate('web.resource.mall.appsaoma')}</span>
              </div>
              <div className={styles.shareModal_shareInfo_box}>
                <div className={styles.shareModal_shareInfo}>
                  <div className={styles.shareModal_shareInfo_imgbox}>
                    <ImageBox width={88} height={88} src={productInfo?.mainPic} />
                  </div>
                  <div className={styles.shareModal_shareInfo_main}>
                    <div className={styles.shareModal_shareInfo_name}>
                      <TagItem
                        tag={translate('web.resource.mall.countrentuan', {
                          count: currentGroupDetail?.assembleNum || 2,
                        })}
                        className={styles.shareModal_shareInfo_tag}
                      />
                      <span>{productInfo?.name}</span>
                    </div>
                    <div className={styles.shareModal_shareInfo_price}>
                      <div className={styles.activity_price}>
                        <i>{translate('web.common.currencySymbol')}</i>
                        <span>{activityPrice}</span>
                      </div>
                      <div className={styles.original_price}>
                        <i>{translate('web.common.currencySymbol')}</i>
                        <span>{originalPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.shareModal_shareInfo_codeBox}>
                    <img className={styles.code} src={appShareCodeImg} />
                    <div className={styles.codeText}>
                      <IconFont type="icon-share_scan" />
                      <span>{translate('web.resource.mall.saomacanyupintun')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.shareModal_btn} onClick={() => createAndSaveImg(appShareRef.current)}>
              {translate('web.resource.mall.baocuntupian')}
            </div>
          </div>
        )
      case 'mini':
        return (
          <div className={styles.shareModal_share_item} id="miniShare">
            <div className={styles.shareModal_share_item_body} ref={miniShareRef}>
              <div className={styles.shareModal_share_item_title}>
                <img src={miniShareIcon} className={styles.share_type_icon} />
                <span>{translate('web.resource.mall.xiaochengxusaoma')}</span>
              </div>
              <div className={styles.shareModal_shareInfo_box}>
                <div className={styles.shareModal_shareInfo}>
                  <div className={styles.shareModal_shareInfo_imgbox}>
                    <ImageBox width={88} height={88} src={productInfo?.mainPic} />
                  </div>
                  <div className={styles.shareModal_shareInfo_main}>
                    <div className={styles.shareModal_shareInfo_name}>
                      <TagItem
                        tag={translate('web.resource.mall.countrentuan', {
                          count: currentGroupDetail?.assembleNum || 2,
                        })}
                        className={styles.shareModal_shareInfo_tag}
                      />
                      <span>{productInfo?.name}</span>
                    </div>
                    <div className={styles.shareModal_shareInfo_price}>
                      <div className={styles.activity_price}>
                        <i>{translate('web.common.currencySymbol')}</i>
                        <span>{activityPrice}</span>
                      </div>
                      <div className={styles.original_price}>
                        <i>{translate('web.common.currencySymbol')}</i>
                        <span>{originalPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.shareModal_shareInfo_codeBox}>
                    <img className={styles.code} src={miniShareCodeImg} />
                    <div className={styles.codeText}>
                      <IconFont type="icon-share_scan" />
                      <span>{translate('web.resource.mall.saomacanyupintun')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.shareModal_btn} onClick={() => createAndSaveImg(miniShareRef.current)}>
              {translate('web.resource.mall.baocuntupian')}
            </div>
          </div>
        )
      default:
        return null
    }
  }, [shareType, appShareCodeImg, miniShareCodeImg, currentGroupDetail])

  const showItemEndTiemById = useCallback(
    (id: number) => {
      const ret = groupList.filter((item) => item.id === id)[0]
      return ret ? ret.endTimeText : ''
    },
    [groupList],
  )

  const handleJoinGroup = (groupId: number) => {
    LinkTo(linkPrefix(`/shop/${productInfo.storeId}/group/detail/${productInfo.id}?groupId=${groupId}&skuId=${skuId}`))
  }

  return groupList && groupList.length > 0 ? (
    <div className={styles.group_buy_container}>
      <div className={styles.group_buy_title}>
        <span>{translate('web.resource.mall.countrenzaipintuankezhijiecanyu', { count: groupList.length })}</span>
      </div>
      <div className={styles.group_list}>{renderCountTime}</div>
      <Modal
        width={600}
        maskClosable
        centered
        open={joinModalVisible}
        footer={null}
        onCancel={() => setJoinModalVisible(false)}
      >
        <div className={styles.joinModal_body}>
          <div className={styles.joinModal_title}>
            {translate('web.resource.mall.canyumemberdepintuan', {
              memberName: replaceNameString(currentGroupInfo?.memberName),
            })}
          </div>
          <div className={styles.joinModal_tip}>
            {translate('web.resource.mall.jinshengnumgeminge', { num: currentGroupInfo?.num })}，
            {currentGroupInfo && showItemEndTiemById(currentGroupInfo.id)}
          </div>
          <div className={styles.joinModal_member_box}>
            <div className={styles.joinModal_member_list}>
              {currentGroupDetail &&
                currentGroupDetail.itemList &&
                currentGroupDetail.itemList.map((item, index) => (
                  <div className={styles.joinModal_member_list_item} key={`joinModal_member_list_item_${index}`}>
                    <div className={styles.member_avatar_box}>
                      <ImageBox
                        width={48}
                        height={48}
                        round={24}
                        src={item.logo || `${getOssUrlPath('/Images/default_logo.png')}`}
                      />
                      {item.isMaster && (
                        <div className={styles.master_tag}>{translate('web.resource.mall.tuanzhang')}</div>
                      )}
                    </div>
                    <div className={styles.member_name}>{replaceNameString(item.memberName)}</div>
                  </div>
                ))}
              <div className={styles.joinModal_member_list_item}>
                <div className={styles.member_avatar_box}>
                  <PlusOutlined translate={undefined} />
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.joinModal_btn}
            onClick={() => currentGroupInfo && handleJoinGroup(currentGroupInfo.id)}
          >
            {translate('web.resource.mall.canyupintuan')}
          </div>
        </div>
      </Modal>
      <Modal
        width={600}
        maskClosable
        centered
        title={translate('web.resource.mall.fenxiangpintuan')}
        open={shareModalVisible}
        footer={null}
        onCancel={() => setShareModalVisible(false)}
      >
        <div className={styles.shareModal_body}>
          <div className={styles.shareModal_line}>
            <div className={styles.shareModal_line_label}>{translate('web.resource.mall.danqiandingdan')}：</div>
            <div className={styles.shareModal_line_brief}>{currentGroupInfo?.orderId}</div>
          </div>
          <div className={styles.shareModal_line}>
            <div className={styles.shareModal_line_label}>{translate('web.resource.mall.laiyuanshangcheng')}：</div>
            <div className={styles.shareModal_line_brief}>{mallInfo?.name}</div>
          </div>
          <div className={styles.shareModal_line}>
            <div className={styles.shareModal_line_label}>{translate('web.resource.mall.cantuanbianhao')}：</div>
            <div className={styles.shareModal_line_brief}>{currentGroupInfo?.id}</div>
          </div>
          <div className={styles.shareModal_type_select}>
            <div className={styles.shareModal_type_select_title}>
              {translate('web.resource.mall.qingxuanzeshengchengleixing')}
            </div>
            <Radio.Group value={shareType} onChange={handleShareTypeChange}>
              <Radio value="web">WEB</Radio>
              {shareDetail && shareDetail.environmentList.includes(4) && <Radio value="app">APP</Radio>}
              {shareDetail && shareDetail.environmentList.includes(3) && (
                <Radio value="mini">{translate('web.common.xiaochengxu')}</Radio>
              )}
            </Radio.Group>
          </div>
          <div className={styles.shareModal_title}>{translate('web.resource.mall.fenxiangpintuanlianjie')}</div>
          <div className={styles.shareModal_member_box}>{renderShareType}</div>
        </div>
      </Modal>
    </div>
  ) : null
}

export default GroupBuy
