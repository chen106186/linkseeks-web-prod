import React, { useState, useRef, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Row, Col, Anchor, Skeleton, Upload, message } from 'antd'
import headStyle from '../../../components/bidDetailHeader/index.less'
import style from './index.less'
import OrderDetailWrapper from '@/pages/transaction/components/orderDetailWrapper'
import PreLoading from '@/components/PreLoading'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { useBidDetail } from '@/pages/procurement/_public/bid/effects/useBidDetail'
import { ArrowLeftOutlined, DeleteOutlined, FileFilled, UploadOutlined } from '@ant-design/icons'
import TransferProcess from '@/pages/procurement/components/transferProcess'
import { findLastIndexFlowState } from '@/utils'
import DescriptionsInfo from '@/pages/procurement/components/descriptionsInfo'
import BidTransformRecord from '@/pages/procurement/components/transferRecord'
import MellowCard from '@/components/MellowCard'
import { authService } from '@apps/services'
import { postPurchaseSubmitTenderSubmitQualifications } from '@apps/apis'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const { Link } = Anchor
const intl = getIntl()

const ReadyQualifityCheckedDetail: React.FC = () => {
  const { accessToken } = authService.getAuth() || {}
  const { formContext, id } = useBidDetail({ type: 'tender' })
  const { data } = formContext

  const [isFixed, setIsFixed] = useState<boolean>(false)
  const flagRef = useRef({
    flag: false,
    distanceTop: 0,
  })
  const [fileList, setFileList] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onScroll = () => {
    let navDom: any = document.getElementById('anchorTitle')
    if (navDom) {
      let distance = navDom.offsetTop - document.documentElement.scrollTop
      if (!flagRef.current.flag) {
        flagRef.current.distanceTop = navDom.offsetTop
        flagRef.current.flag = true
      }

      if (distance <= 0) {
        setIsFixed(true)
      }

      if (document.documentElement.scrollTop <= flagRef.current.distanceTop) {
        setIsFixed(false)
      }
    }
  }

  const isLoading = !!formContext.data

  const anchorTitleList = [
    { title: intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' }), id: 'transferProcess' },
    { title: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }), id: 'baseicInfo' },
    { title: intl.formatMessage({ id: 'table.purchase.zigeyushenyao' }), id: 'checkNeed' },
    { title: intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' }), id: 'qualifityNeed' },
    { title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }), id: 'transferRecord' },
  ]

  const uploadProps = {
    name: 'file',
    action: '/api/support/file/upload/prefix',
    data: {
      fileType: 1,
      prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
    },
    headers: {
      accessToken,
    },
    itemRender: () => null,
    fileList,
    onChange(info) {
      if (info.file.status === 'error') {
        message.error(`${info.file.name} ${intl.formatMessage({ id: 'table.purchase.shangchuanshibai' })}`)
      }
      setFileList(() =>
        info.fileList.map((item) => {
          if (item?.response) {
            return {
              ...item.response.data,
              name: item.response.data.name.split('/').pop(),
            }
          } else {
            return {
              ...item,
            }
          }
        }),
      )
    },
    beforeUpload(file) {
      if (file.name.length > 100) {
        message.warning(intl.formatMessage({ id: 'table.purchase.wenjianmingguochang' }))
        return Promise.reject()
      }
      if (file.size / 1024 / 1024 > 20) {
        message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
        return Promise.reject()
      }
    },
  }

  const removeItem = (item) => {
    setFileList(() => [...fileList].filter((ele) => ele.url !== item.url))
  }

  // 提交资格预审
  const handleSubmit = () => {
    if (fileList.length) {
      setLoading(true)
      postPurchaseSubmitTenderSubmitQualifications({ submitTenderId: data.id, qualificationsFile: fileList })
        .then((res) => {
          if (res.code === 1000) {
            history.goBack()
          }
        })
        .finally(() => setLoading(false))
    } else {
      message.error(intl.formatMessage({ id: 'table.purchase.qingshangchuanzige' }))
    }
  }

  return (
    <div>
      <BidDetailContext.Provider value={formContext}>
        <div
          className={isFixed ? [headStyle.detailHeader, headStyle.anchorTitleFixed].join(' ') : headStyle.detailHeader}
          id="detailHeader"
        >
          {isLoading ? (
            <Row>
              {
                <>
                  <Col span={22}>
                    <Row align="middle">
                      <Col>
                        <ArrowLeftOutlined onClick={() => history.goBack()} />
                      </Col>
                      <Col>
                        <div className={headStyle.titleAvatorText}>
                          {data.inviteTender.projectName}&nbsp;|&nbsp;{data.inviteTender.code}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className={headStyle.anchorTitle} id="anchorTitle">
                          <Anchor onClick={(e) => e.preventDefault()} showInkInFixed={false} targetOffset={200}>
                            {anchorTitleList.map((item, index) => (
                              <Link key={index} href={`#${item['id']}`} title={item['title']} />
                            ))}
                          </Anchor>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={2}>
                    <Button type="primary" onClick={handleSubmit} loading={loading}>
                      {intl.formatMessage({ id: 'table.purchase.tijiao' })}
                    </Button>
                  </Col>
                </>
              }
            </Row>
          ) : (
            <Skeleton avatar={{ shape: 'square' }} active paragraph={{ rows: 3 }} />
          )}
        </div>

        <OrderDetailWrapper>
          <PreLoading loading={!formContext.data} active paragraph={{ rows: 6 }}>
            <div id="transferProcess" style={{ marginTop: 100 }}>
              <TransferProcess
                cardTitle={intl.formatMessage({ id: 'table.purchase.liuzhuanjindu' })}
                customTitleKey="name"
                customKey="id"
                outerVerifyCurrent={findLastIndexFlowState(formContext?.externalWorkflowFlowRecordLogResponses || [])}
                innerVerifyCurrent={findLastIndexFlowState(formContext?.interiorWorkflowFlowRecordLogResponses || [])}
                outerVerifySteps={
                  formContext?.externalWorkflowFlowRecordLogResponses
                    ? formContext.externalWorkflowFlowRecordLogResponses.map((item) => ({
                        ...item,
                        status: item.isActive ? 'finish' : 'wait',
                      }))
                    : []
                }
                innerVerifySteps={
                  formContext?.interiorWorkflowFlowRecordLogResponses
                    ? formContext.interiorWorkflowFlowRecordLogResponses.map((item) => ({
                        ...item,
                        status: item.isActive ? 'finish' : 'wait',
                      }))
                    : []
                }
              />
            </div>
            <div id="baseicInfo">
              <DescriptionsInfo cardTitle={intl.formatMessage({ id: 'table.purchase.jibenxinxi' })} type="basicInfo" />
            </div>
            <div id="checkNeed">
              <DescriptionsInfo
                cardTitle={intl.formatMessage({ id: 'table.purchase.zigeyushenyao' })}
                type="checkNeed"
              />
            </div>
            <div id="qualifityNeed">
              <MellowCard
                title={intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' })}
                style={{ marginTop: 24 }}
                bordered={false}
                fullHeight
              >
                <div className={style['card-list']}>
                  <Row>
                    <Col span={2}>
                      <p className={style['card-list_title']}>
                        {intl.formatMessage({ id: 'table.purchase.zigezhengmingwen' })}:
                      </p>
                    </Col>
                    <Col>
                      {fileList.map((item, index) => (
                        <p key={index} className={style.fileItem}>
                          <a href={item.url}>
                            <FileFilled /> {item.name}
                          </a>{' '}
                          <span onClick={() => removeItem(item)}>
                            <DeleteOutlined />
                          </span>
                        </p>
                      ))}
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>
                          {intl.formatMessage({ id: 'table.purchase.shangchuanfujian' })}
                        </Button>
                      </Upload>
                    </Col>
                  </Row>
                </div>
              </MellowCard>
            </div>
            <div id="transferRecord">
              <BidTransformRecord cardTitle={intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' })} />
            </div>
          </PreLoading>
        </OrderDetailWrapper>
      </BidDetailContext.Provider>
    </div>
  )
}

export default ReadyQualifityCheckedDetail
