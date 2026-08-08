import React, { useEffect, useState } from 'react'
import { Anchor, Radio, Row, Col, Upload, Button, Modal, Form, message, Input, Space } from 'antd'
import style from './index.less'
import { ArrowLeftOutlined, FileWordFilled, UploadOutlined } from '@ant-design/icons'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Basic from '../../components/detailCard/basic'
const { TextArea } = Input
import StepListItem from './components/Record' // 流转进度条
import PurchaseList from './components/PurchaseList' // 关联商品组建
import CirculationList from './components/CirculationList' // 流转列表
// import DetailedList from './detailedList'
import SituationList from './components/SituationList' //付款明细
import { Download } from '../../constants/utils'
import PopupDrawer from './components/Popup' // 显示隐藏
import {
  getContractCoordinationGetDetail,
  GetContractCoordinationGetDetailResponse,
  getContractSignatureGetHandSignatureUrl,
  getContractSignatureGetSignatorySignStatus,
  postContractCoordinationExamineStepOne,
  postContractCoordinationExamineStepTwo,
  postContractCoordinationSign,
  postContractCoordinationSubmitExamine,
} from '@apps/apis'
// import { getSettlementBusinessApplyAmountDetailApplyAmount } from '@apps/apis';
import Associated from '../../components/detailCard/associated'
import ContractVersions from '../../components/ContractVersions'
import cx from 'classnames'
import DetailedList from '../../contractexecution/details/components/DetailedList'
import { useQuery } from '@linkseeks/router-core'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from '@linkseeks/ui'

const { Link } = Anchor
const activeAnchorClassName = 'ant-anchor-link-active'
const Details = (props: any) => {
  const [form] = Form.useForm()
  const [Visible, setIsModalVisible] = useState<boolean>(false)
  const [isPass, setIsAllMember] = useState(1)
  const [detail, setDetail] = useState<GetContractCoordinationGetDetailResponse>()
  const [contractNo, setcontractNo] = useState<any>()
  /* 合同id */
  const { contractId, type, status } = useQuery()
  console.log(type)
  const [currLink, setCurrLink] = useState(activeAnchorClassName)
  /**
   * 渲染信息
   * @param basics 基础信息
   *
   */
  /** 基本信息 */
  const [basicInfo, setbasicInfo] = useState<any>({
    col1: [],
    col2: [],
    col3: [],
  })

  /** 关联信息 */
  const [associatedInfo, setAssociatedInfo] = useState<any>({
    col1: [],
    col2: [],
  })
  /**
   * @param StepList 流转进度
   * @param outerTaskStepList 外部
   * @param innerTaskStepList 内部
   * @param ListData 采购
   * @param payPlanList 付款计划
   * @param contractText 合同文档
   */
  const intl = getIntl()
  const [outerTaskStepList, setouterTaskStepList] = useState<any>([])
  const [innerTaskStepList, setinnerTaskStepList] = useState<any>([])
  const [setListData] = useState<any>([])
  // const [payPlanList, setpayPlanList] = useState<any>([])
  const [contractText, setcontractText] = useState<any>([])
  const [signatureLogId, setsignatureLogId] = useState<any>('') // 签署地址id
  const [setstate] = useState<any>(false)
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined)
  const [contractAbstract, setcontractAbstract] = useState('')
  const [tabPane, settabPane] = useState([])
  const [Popup, setPopup] = useState<any>(false)
  const [basicData] = useState<any>({
    invoiceProveVOList: [],
  }) // 合同付款基本信息
  const [contractUrl, setcontractUrl] = useState('')

  const [contractVersionVO, setContractVersionVO] = useState([])

  const [oldContractCoordinationDetailVOData, setOldContractCoordinationDetailVOData] = useState<any>()
  const [isContractNew, setIsContractNew] = useState<boolean>(true)

  /* 获取详情的数据 */
  const getDetail = () => {
    getContractCoordinationGetDetail({ contractId })
      .then((res) => {
        if (res.code === 1000) {
          const { basics, oldContractCoordinationDetailVO } = res.data
          setsignatureLogId(basics.signatureLogId)
          setDetail(res.data)
          const basicInfos: any = {
            col1: [
              {
                label: intl.formatMessage({ id: 'contract.hetongbianhao' }),
                extra: basics.contractNo ? basics.contractNo : '',
                old:
                  type != 'implement' &&
                  oldContractCoordinationDetailVO?.basics?.contractNo &&
                  oldContractCoordinationDetailVO?.basics?.contractNo !== basics.contractNo
                    ? oldContractCoordinationDetailVO?.basics?.contractNo
                    : null,
              },
              {
                label: intl.formatMessage({ id: 'contract.hetongzhaiyao' }),
                extra: basics.contractAbstract ? basics.contractAbstract : '',
                old:
                  type != 'implement' &&
                  oldContractCoordinationDetailVO?.basics?.contractAbstract &&
                  oldContractCoordinationDetailVO?.basics?.contractAbstract !== basics.contractAbstract
                    ? oldContractCoordinationDetailVO?.basics?.contractAbstract
                    : null,
              },
              {
                label: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
                extra: basics.outerStatusName ? basics.outerStatusName : '',
                type: 'StatusTag',
              },
            ],
            col2: [
              {
                label: intl.formatMessage({ id: 'contract.xunyuanleixing' }),
                extra:
                  basics.sourceType == 4 ? intl.formatMessage({ id: 'contract.xinjian' }) : basics.sourceTypeName || '',
              },
              {
                label: intl.formatMessage({ id: 'contract.hetongyouxiaoqi' }),
                extra: `${basics.startTime}${intl.formatMessage({ id: 'common.text.to' })}${basics.endTime}`,
                old:
                  type != 'implement' &&
                  oldContractCoordinationDetailVO?.basics?.startTime &&
                  (oldContractCoordinationDetailVO?.basics?.startTime != basics.startTime ||
                    oldContractCoordinationDetailVO?.basics?.endTime != basics?.endTime)
                    ? `${oldContractCoordinationDetailVO?.basics?.startTime}${intl.formatMessage({
                        id: 'common.text.to',
                      })}${oldContractCoordinationDetailVO?.basics?.endTime}`
                    : null,
              },
              // { label: intl.formatMessage({ id: 'contract.duiyingdanju' }), extra: basics.sourceNo ? basics.sourceNo : '' },
            ],
            col3: [],
          }
          // if (type) {
          //   basicInfos.col1[0].url = `/contract/coordination/coordinationList/detail?contractId=${contractId}`
          // }

          const associatedInfos: any = {
            col1: [
              {
                label: intl.formatMessage({ id: 'contract.duiyingdanju' }),
                extra: basics.sourceNo ? basics.sourceNo : '',
              },
              // { label: intl.formatMessage({ id: 'contract.buyer' }), extra: basics.partyBName ? basics.partyBName : ''  },
            ],
            col2: [
              {
                label: intl.formatMessage({ id: 'contract.currency' }),
                extra: basics.currencyTypeName ? basics.currencyTypeName : '',
                old:
                  type != 'implement' &&
                  oldContractCoordinationDetailVO?.basics &&
                  (basics.currencyTypeName || oldContractCoordinationDetailVO?.basics?.currencyTypeName) &&
                  basics.currencyTypeName != oldContractCoordinationDetailVO?.basics?.currencyTypeName
                    ? oldContractCoordinationDetailVO?.basics?.currencyTypeName
                    : null,
              },
              {
                label: intl.formatMessage({ id: 'contract.contractAmount' }),
                extra: basics.totalAmount ? `${basics.totalAmount}` : '',
                old:
                  type != 'implement' &&
                  oldContractCoordinationDetailVO?.basics &&
                  basics.totalAmount != oldContractCoordinationDetailVO?.basics?.totalAmount
                    ? oldContractCoordinationDetailVO?.basics?.totalAmount
                    : null,
              },
            ],
          }

          if (type != 'implement') {
            basicInfos.col2.push({
              label: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
              extra: basics.innerStatusName ? basics.innerStatusName : '',
            })
            associatedInfos.col1.push(
              {
                label: intl.formatMessage({ id: 'contract.buyer' }),
                extra: basics.partyAName ? basics.partyAName : '',
              },
              // { label: intl.formatMessage({ id: 'contract.shoubiaojine' }), extra: basics.totalAmount ? `${intl.formatMessage({ id: 'common.money' })}${basics.totalAmount}` : '' },
            )
          } else {
            associatedInfos.col1.push({
              label: intl.formatMessage({ id: 'contract.hetongjiafang' }),
              extra: basics.partyAName ? basics.partyAName : '',
            })
            // basicInfos.col3.unshift(
            //   { label: intl.formatMessage({ id: 'contract.hetongjine' }), extra: basics.totalAmount ? `${intl.formatMessage({ id: 'common.money' })}${basics.totalAmount}` : '' },
            // )
          }
          if (basics.sourceId) {
            switch (basics.sourceType) {
              case 1: {
                // memberCenter/procurementAbility/offter/offter/preview?id=1568&numberXJPJ63501
                // if (basics.turn && basics.sourceId) {
                associatedInfos.col1[0].url = `/procurementAbility/offter/offter/preview?id=${basics.sourceId}&numberXJPJ63501=${basics.sourceNo}`
                // basicInfos.col2[1].url = `/procurementAbility/confirmOffer/offerInquire/preview?id=${basics.sourceId}&turn=${basics.turn}`
                // }
                break
              }
              case 2: {
                associatedInfos.col1[0].url = `/procurementAbility/callForBids/callForBidsSearch/detail?id=${basics.sourceId}`
                break
              }
              case 3: {
                associatedInfos.col1[0].url = `/procurementAbility/purchaseBid/search/detail?id=${basics.sourceId}&number=${basics.sourceNo}`
                break
              }
              case 4: {
                const urlData = `/procurementAbility/purchaseRequisition/purchaseRequisitionList/preview?id=${basics.sourceId}`
                associatedInfos.col1[0].url = urlData
                break
              }
            }
          }
          setOldContractCoordinationDetailVOData(oldContractCoordinationDetailVO)
          setContractVersionVO(res.data.contractVersionVO)
          setAssociatedInfo(associatedInfos)
          setbasicInfo(basicInfos)
          setouterTaskStepList(res.data.outerTaskStepList)
          setinnerTaskStepList(res.data.innerTaskStepList)
          // setpayPlanList(applyAmountOrderList ? applyAmountOrderList : [])
          setcontractText(res.data.contractText)
          setcontractNo(basics.contractNo)
          setcontractAbstract(res.data.basics.contractAbstract)
        }
      })
      .catch(() => {})
  }
  useEffect(() => {
    const tab = []
    if (type == 'implement') {
      tab.push(
        { key: 'process', label: intl.formatMessage({ id: 'contract.rules.header.info' }) },
        { key: 'associated', label: intl.formatMessage({ id: 'contract.associateInformation' }) },
        { key: 'versions', label: intl.formatMessage({ id: 'contract.versions' }) },
        { key: 'docking', label: intl.formatMessage({ id: 'contract.zhixingqingkuang' }) },
        { key: 'record', label: intl.formatMessage({ id: 'contract.qingkuantongji' }) },
      )
    } else {
      tab.push(
        { key: 'progress', label: intl.formatMessage({ id: 'contract.liuzhuanjindu' }) },
        { key: 'process', label: intl.formatMessage({ id: 'contract.rules.header.info' }) },
        { key: 'associated', label: intl.formatMessage({ id: 'contract.associateInformation' }) },
        { key: 'materials', label: intl.formatMessage({ id: 'contract.caigoucailiao' }) },
        { key: 'docking', label: intl.formatMessage({ id: 'contract.contract.info' }) },
        { key: 'versions', label: intl.formatMessage({ id: 'contract.versions' }) },
        { key: 'record', label: intl.formatMessage({ id: 'contract.liuzhuanjilu' }) },
      )
    }
    settabPane(tab)
    setTargetOffset(window.innerHeight / tab.length)
    getDetail()
  }, [])

  const handleAnchorClick = (e) => {
    e.preventDefault()
  }
  const handleAnchorChange = (link) => {
    if (link && currLink) {
      setCurrLink('')
    } else if (!link && !currLink) {
      setCurrLink(activeAnchorClassName)
    }
  }

  const fileTypeLimitList = [
    'application/pdf', // pdf
    'application/msword', //doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
    'application/vnd.ms-excel', // xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //xlsx
  ]

  const uploadProps = {
    name: 'file',
    action: '/api/support/file/upload/prefix',
    data: {
      fileType: 1,
      prefix: FILE_PREFIX_ENUM.CONTRACT_SERVICE,
    },
    onChange(info) {
      if (info.file.response) {
        console.log(info.file)
        const {
          code,
          data: { url },
        } = info.file.response
        console.log(code)

        if (info.file.status == 'done') {
          setcontractUrl(url)
          message.info(intl.formatMessage({ id: 'contract.shangchuanchenggong' }))
          setstate(true)
        } else if (info.file.status == 'removed') {
          setcontractUrl('')
        }
      }
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} ${intl.formatMessage({ id: 'contract.shangchuanshibai' })}`)
      }
    },
    beforeUpload(file) {
      if (!fileTypeLimitList.includes(file.type)) {
        message.warning(intl.formatMessage({ id: 'contract.fujiandaxiaochaoguo.limit' }))
        return Upload.LIST_IGNORE
      }
      if (file.size / 1024 / 1024 > 20) {
        message.warning(intl.formatMessage({ id: 'contract.fujiandaxiaochaoguo20M' }))
        // return Promise.reject();
        return Upload.LIST_IGNORE
      }
    },
  }
  /* 提交表单 */
  const submitExamine = async () => {
    console.log(detail, 'detail')
    if (type === 'sign' && contractText.isUseElectronicContract == 1) {
      console.log(signatureLogId)
      const ress = await getContractSignatureGetHandSignatureUrl({ signatureLogId })
      if (ress.code == 1000) {
        console.log(ress)
        window.open(ress.data.url)
        let timer = setInterval(() => {
          getContractSignatureGetSignatorySignStatus({ signatureLogId }).then((res) => {
            if (res.code === 1000) {
              const arr = [2, 3, 4]
              if (arr.includes(res.data.signResult)) {
                clearInterval(timer)
                timer = null
                let Pass
                if (res.data.signResult === 2) {
                  Pass = 1
                } else if (res.data.signResult === 4) {
                  Pass = 0
                } else if (res.data.signResult === 3) {
                  return
                }
                postContractCoordinationSign({
                  contractId,
                  Pass,
                })
                history.goBack()
              }
            }
          })
        }, 3000)
      }
    } else {
      setIsModalVisible(!Visible)
    }
    // let flag = false;
    // ListData.every((item => {
    //   if (item.associatedDataId && item.associatedMaterielNo) {
    //     flag = true;
    //   }
    // }))
    // if (!flag) {
    //   message.info('请先关联报价商品');
    // } else {

    // }
  }
  const handleIsAllMemberChange = (v: any) => {
    setIsAllMember(v.target.value)
  }
  /* 审核 */
  const onFinish = (values: any) => {
    values.contractId = contractId
    console.log('Success:', values)
    // history.push('/contract/coordination/sign')
    // return;
    let fn: any
    switch (type) {
      case 'submitExamine':
        fn = postContractCoordinationSubmitExamine
        break
      case 'levelexamine':
        fn = postContractCoordinationExamineStepOne
        break
      case 'pageToBeExamineTwo':
        fn = postContractCoordinationExamineStepTwo
        break
      case 'sign':
        fn = postContractCoordinationSign
        values.contractUrl = contractUrl
        break
      default:
        break
    }
    // if (type === 'sign' && !state && values?.isPass == 1) {
    //   console.log(type, state)
    //   message.warning(intl.formatMessage({ id: 'contract.qingxianshangchuanhetong' }));
    //   return;
    // } else {
    const msg = message.loading({
      content: intl.formatMessage({ id: 'contract.zhengzaicaozuo' }),
      duration: 0,
    })
    fn(values)
      .then((res) => {
        console.log(res)
        if (res.code === 1000) {
          setIsModalVisible(!Visible)
          setTimeout(() => {
            switch (type) {
              case 'submitExamine':
                history.push('/contract/coordination/pageToBeSubmitExamine')
                break
              case 'levelexamine':
                history.push('/contract/coordination/pageToBeExamineOne')
                break
              case 'pageToBeExamineTwo':
                history.push('/contract/coordination/pageToBeExamineTwo')
                break
              case 'sign':
                history.push('/contract/coordination/sign')
                break
              default:
                break
            }
          }, 2000)
        }
      })
      .finally(() => {
        msg()
      })
    // }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  /* 关联商品回调 */
  const Refresh = (data) => {
    setListData(data)
    getDetail()
  }

  const [applyId] = useState<any>('')
  const [applyNo] = useState<any>('')
  /* 点击查看详情回调 */
  // const setkey = (item) => {
  //   setDrawerModal()
  //   if (item.id) {
  //     setapplyId(item.id)
  //     setapplyNo(item.applyAmountNo)
  //     // api/settle/accounts/business/apply/amount/detail/apply/amount
  //     // getContractExecuteExecuteInfoPayDetailInfo
  //     getSettlementBusinessApplyAmountDetailApplyAmount({
  //       applyNo: item.applyAmountNo,
  //       applyAmountId: item.id,
  //     }).then((res: any) => {
  //       console.log(res);
  //       if (res.code === 1000) {
  //         console.log(res.data)
  //         res.data.invoiceProveVOList = res.data.invoiceProveVOList ? res.data.invoiceProveVOList : [];
  //         setbasicData(res.data)

  //       }
  //     })
  //   }

  // }
  /* 查看付款明细回调 */
  const setDrawerModal = () => {
    setPopup(!Popup)
  }

  /** 合同版本 */
  const versionsHtml = () => (
    <Card id="versions" title={intl.formatMessage({ id: 'contract.versions' })}>
      <ContractVersions
        contractId={contractId}
        contractVersionVO={contractVersionVO}
        jumpUrl={`/contract/coordination/coordinationList/detail?contractId=`}
      />
    </Card>
  )

  return (
    <div className={style.anchorWrap}>
      <PageHeaderWrapper
        items={tabPane}
        backDom
        extra={
          status === 'submit' && (
            <div className="btn" style={{ marginRight: '20px' }}>
              <Button type="primary" onClick={() => submitExamine()}>
                {type === 'sign'
                  ? intl.formatMessage({ id: 'contract.qiandinghetong' })
                  : intl.formatMessage({ id: 'contract.shenhe' })}
              </Button>
            </div>
          )
        }
      >
        <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
          {/* 流转进度 */}
          {type != 'implement' && (
            <StepListItem outerTaskStepList={outerTaskStepList} innerTaskStepList={innerTaskStepList} />
          )}
          {/* 基本信息 */}
          <Basic basicInfo={basicInfo} />

          {/* 关联信息 */}
          <Associated associatedInfo={associatedInfo} />

          {type == 'implement' && versionsHtml()}

          {/* 执行情况 */}
          {type == 'implement' ? (
            <SituationList contractId={contractId} TabList={contractVersionVO} />
          ) : (
            <PurchaseList
              contractId={contractId}
              oldContractId={oldContractCoordinationDetailVOData?.basics?.id}
              type={type}
              Refresh={Refresh}
            />
          )}
          {/* 请款统计 */}
          {type == 'implement' && contractVersionVO ? (
            <DetailedList contractId={contractId} TabList={contractVersionVO} />
          ) : null}
          {/* 合同信息 */}
          {type != 'implement' && (
            <Card
              id="docking"
              title={intl.formatMessage({ id: 'contract.contract.info' })}
              extra={
                oldContractCoordinationDetailVOData?.contractText &&
                oldContractCoordinationDetailVOData.contractText.contractUrl != contractText?.contractUrl ? (
                  <div className={style.changeBtn}>
                    <div
                      className={cx(style.btn, !isContractNew ? style.active : '')}
                      onClick={() => setIsContractNew(false)}
                    >
                      变更前
                    </div>
                    <div
                      className={cx(style.btn, isContractNew ? style.active : '')}
                      onClick={() => setIsContractNew(true)}
                    >
                      变更后
                    </div>
                  </div>
                ) : null
              }
            >
              {(
                isContractNew
                  ? contractText?.contractName
                  : oldContractCoordinationDetailVOData?.contractText?.contractName
              ) ? (
                <div className={style.upload_item} style={{ width: 680 }}>
                  <div className="ant-card-head-wrapper">
                    {(
                      isContractNew
                        ? contractText.isUseElectronicContract != 1
                        : oldContractCoordinationDetailVOData?.contractText?.isUseElectronicContract != -1
                    )
                      ? intl.formatMessage({ id: 'contract.zhizhihetong' })
                      : intl.formatMessage({ id: 'contract.dianzihetong' })}
                  </div>
                  <div
                    className={style.upload_left}
                    style={{ width: 600 }}
                    onClick={() =>
                      Download(
                        isContractNew
                          ? contractText.contractName
                          : oldContractCoordinationDetailVOData?.contractText?.contractName,
                        isContractNew
                          ? contractText.contractUrl
                          : oldContractCoordinationDetailVOData?.contractText?.contractUrl,
                      )
                    }
                  >
                    <FileWordFilled />
                    <span>
                      {isContractNew
                        ? contractText.contractName
                        : oldContractCoordinationDetailVOData?.contractText?.contractName}
                    </span>
                  </div>
                </div>
              ) : null}
            </Card>
          )}

          {type != 'implement' && versionsHtml()}

          {/* 流转记录 */}
          {type != 'implement' ? <CirculationList contractId={contractId} /> : null}
        </Space>
      </PageHeaderWrapper>
      {/* 提交审核  */}
      <Modal
        footer={null}
        title={
          type == 'sign'
            ? intl.formatMessage({ id: 'contract.qiandinghetong' })
            : intl.formatMessage({ id: 'contract.tijiaoshenhe' })
        }
        open={Visible}
        onOk={() => setIsModalVisible(!Visible)}
        onCancel={() => setIsModalVisible(!Visible)}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {type == 'sign' && (
            <div>
              <p style={{ paddingTop: 10, paddingBottom: 10 }}>
                {intl.formatMessage({ id: 'contract.zhizhihetongyifangyi' })}
              </p>
              <Row style={{ marginBottom: 30 }}>
                <Col span={24}>
                  <Upload {...uploadProps} accept=".doc,.docx,.pdf,.xls,.xlsx" maxCount={1}>
                    <Button icon={<UploadOutlined />}>{intl.formatMessage({ id: 'contract.shangchuanfujian' })}</Button>
                  </Upload>
                </Col>
                <Col style={{ marginTop: 10 }}>
                  <text style={{ color: '#999' }}>
                    {intl.formatMessage({ id: 'contract.fujiandaxiaochaoguo.limit' })}
                  </text>
                </Col>
              </Row>
            </div>
          )}
          <Form.Item
            name="isPass"
            label=""
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'contract.qingxuanzezuofeiriqi' }),
              },
            ]}
            initialValue={isPass}
          >
            <Radio.Group onChange={handleIsAllMemberChange}>
              <Radio value={1}>{intl.formatMessage({ id: 'contract.tongguo' })}</Radio>
              <Radio value={0}>{intl.formatMessage({ id: 'contract.butongguo' })}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={
              isPass
                ? intl.formatMessage({ id: 'contract.shenhetongguoyuanyin' })
                : intl.formatMessage({ id: 'contract.shenhebutongguoyuanyin' })
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'contract.qingxuanzezuofeiriqi' }),
              },
            ]}
          />
          <Form.Item
            label=""
            name="opinion"
            rules={[
              {
                required: isPass ? false : true,
                message: intl.formatMessage({ id: 'contract.shenhebutongguoyijian' }),
              },
            ]}
          >
            <TextArea placeholder={intl.formatMessage({ id: 'contract.zaicishurunideyuanyin' })} maxLength={120} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsModalVisible(!Visible)} style={{ marginRight: 10 }}>
              {intl.formatMessage({ id: 'contract.quxiao' })}
            </Button>
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: 'contract.baocun' })}
            </Button>
          </div>
        </Form>
      </Modal>
      {/* 查看付款计划明细弹出组建 */}
      <PopupDrawer
        popupshow={Popup}
        applyNo={applyNo}
        basicData={basicData}
        setDrawerModal={setDrawerModal}
        applyId={applyId}
      />
    </div>
  )
}
export default Details
