import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { LeftOutlined, RightOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import { LinkTo } from '@/utils'
import { message } from 'antd'
import {
  getProductShopCommodityCollectGetCommodityCollect,
  postProductShopCommodityCollectDeleteCommodityCollect,
  postProductShopCommodityCollectSaveCommodityCollect,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { GetProductShopStoreGetCommodityDetailResponse } from '@apps/apis'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'
import { Modal, Image } from 'antd'

interface ImgItemType {
  id: string
  commodityPic: string
}

interface ExhibitionPropsType {
  imgList: ImgItemType[]
  commodityDetail: GetProductShopStoreGetCommodityDetailResponse
}

const Exhibition: React.FC<ExhibitionPropsType> = (props) => {
  const translate = getWebIntl()
  const { imgList = [], commodityDetail } = props
  const [previewImg, setPreviewImg] = useState<any>()
  const [offSetLeft, setOffSetLeft] = useState<number>(0)
  const [collectState, setCollectState] = useState<boolean>(false)
  const [collectCount, setCollectCount] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [previewImagUlr, setPreviewImgUrl] = useState<string>('')
  const { mallInfo, userInfo, url } = useGlobalConext()

  let collectFlg = true
  useEffect(() => {
    if (commodityDetail) {
      getCollectState()
    }
  }, [commodityDetail])

  useEffect(() => {
    if (imgList.length > 0) {
      setPreviewImg(imgList[0])
    }
  }, [imgList])

  const handlePrev = () => {
    if (offSetLeft < 0) {
      setOffSetLeft(offSetLeft + 70)
    }
  }

  const handleNext = () => {
    const imgLength = imgList.length
    const maxDistance = (imgLength - 5) * 70

    if (maxDistance > Math.abs(offSetLeft)) {
      setOffSetLeft(offSetLeft - 70)
    }
  }

  /**
   * 获取收藏状态
   */
  const getCollectState = () => {
    if (userInfo) {
      const param: any = {
        commodityId: commodityDetail?.id,
      }
      const headers = {
        shopId: mallInfo?.id,
      }
      getProductShopCommodityCollectGetCommodityCollect(param, { headers } as any).then((res) => {
        if (res.code === 1000) {
          setCollectState(res.data.isCollect)
          setCollectCount(res.data.count)
        }
      })
    }
  }

  /**
   * 收藏或取消收藏
   */
  const handleToggleCollect = validateLoginWrapper(() => {
    // if (!userInfo) {
    //   if (collectFlg) {
    //     collectFlg = false
    //     message.info(translate('web.resource.mall.qingxiandenglu'))
    //     setTimeout(() => {
    //       collectFlg = true
    //       LinkTo(LOGIN_DOMAIN, 'replace')
    //     }, 1500)
    //   }
    // }
    if (collectFlg) {
      collectFlg = false
      let postFn
      const param: any = {
        commodityId: commodityDetail?.id,
      }

      const headers = {
        shopId: mallInfo?.id,
      }

      if (collectState) {
        postFn = postProductShopCommodityCollectDeleteCommodityCollect
      } else {
        postFn = postProductShopCommodityCollectSaveCommodityCollect
      }
      postFn &&
        postFn(param, { headers, ctlType: 'none' } as any)
          .then((res) => {
            if (res.code === 1000) {
              message.destroy()
              if (collectState) {
                message.success(translate('web.resource.mall.quxiaoshoucangchenggong'))
                setCollectState(false)
                setCollectCount(collectCount - 1)
              } else {
                setCollectState(true)
                setCollectCount(collectCount + 1)
                message.success(translate('web.resource.mall.shoucangchenggong'))
              }
            }
            collectFlg = true
          })
          .catch(() => {
            collectFlg = true
          })
    }
  })

  const handlePreviewImg = (imageUrl: string) => {
    setPreviewImgUrl(imageUrl)
    setIsOpen(true)
  }

  return (
    <div className={styles.exhibition}>
      <div className={styles.exhibition_img_container} onClick={() => handlePreviewImg(previewImg?.commodityPic)}>
        <img src={previewImg?.commodityPic} />
      </div>
      <div className={styles.exhibition_toolbar}>
        <div className={cx(styles.exhibition_tool_item, styles.prev)} onClick={() => handlePrev()}>
          <LeftOutlined translate={undefined} />
        </div>
        <div className={styles.exhibition_list_contaner}>
          <div className={styles.exhibition_list} style={{ left: offSetLeft }}>
            {imgList.map((item, index) => (
              <div
                key={index}
                className={cx(styles.exhibition_list_item, previewImg?.id === item.id ? styles.active : '')}
                onClick={() => setPreviewImg(item)}
              >
                <img src={item.commodityPic} />
              </div>
            ))}
          </div>
        </div>
        <div className={cx(styles.exhibition_tool_item, styles.next)} onClick={() => handleNext()}>
          <RightOutlined translate={undefined} />
        </div>
      </div>
      <div
        className={cx(styles.collection_state, collectState ? styles.active : '')}
        onClick={() => handleToggleCollect()}
      >
        {collectState ? <StarFilled translate={undefined} /> : <StarOutlined translate={undefined} />}
        <label>
          {translate('web.resource.mall.shoucangshangpin')}
          {collectCount > 0 ? `(${collectCount})` : ''}
        </label>
      </div>
      <Modal title="查看" open={isOpen} onCancel={() => setIsOpen(false)} footer={null} width={800} centered={true}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <img src={previewImagUlr} width={600} height={600}></img>
        </div>
      </Modal>
    </div>
  )
}

export default Exhibition
