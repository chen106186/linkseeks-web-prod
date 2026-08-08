import React, { useEffect, useMemo, useState } from 'react'
import { Anchor, Radio, Table, Steps, Space, Typography, Button } from 'antd'
import style from './index.less'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import ExamineFrom from '../../components/examine'
import Basic from '../../components/detailCard/basic'
import PaymentCard from '../../components/detailCard/PaymentCard'
import TableList from './components/TableList'
import { FileWordFilled } from '@ant-design/icons'
import {
  getContractManageGetDetail,
  getContractManagePagePurchaseMaterielList,
  getContractPurchaseRequisitionPageByProductIds,
  getContractSignatureGetHandSignatureUrl,
  getContractSignatureGetSignatorySignStatus,
  postContractManageSign,
} from '@apps/apis'
import Associated from '../../components/detailCard/associated'
import { purchasecolumns } from './Table'
import ModalTable from '@/components/ModalTable'
import BigNumber from 'bignumber.js'
import ContractVersions from '../../components/ContractVersions'
import cx from 'classnames'
import { useQuery } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'

const { Link } = Anchor
const { Step } = Steps
const intl = getIntl()
const { Text } = Typography
const activeAnchorClassName = 'ant-anchor-link-active'
const Details = (props: any) => {
  /* 合同id */
  const { contractId, type, status } = useQuery()
  const [currLink, setCurrLink] = useState(activeAnchorClassName)
  const translate = useWebIntl()

  const showExamineBtn = useMemo(() => {
    return status === 'examine'
  }, [status])
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
   * @param tableList 外部内容 表格
   * @param ListData 采购
   * @param payPlanList 付款计划
   * @param contractText 合同文档
   */
  const [StepList, setStepList] = useState<any>([])

  const [outerTaskStepList, setouterTaskStepList] = useState<any>([])
  const [innerTaskStepList, setinnerTaskStepList] = useState<any>([])
  const [currentBatch, setCurrentBatch] = useState('1')
  const [listIndex, setlistIndex] = useState('1')
  const [Visible, setIsModalVisible] = useState<boolean>(false)
  const [ListData, setListData] = useState<any>([])
  const [oldListData, setOldListData] = useState<any>([])
  const [payPlanList, setpayPlanList] = useState<any>([])
  const [oldPayPlanList, setOldPayPlanList] = useState<any>([])
  const [contractText, setcontractText] = useState<any>([])
  const [oldContractText, setoldContractText] = useState<any>()
  const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined)
  const [contractAbstract, setcontractAbstract] = useState('')
  const [signatureLogId, setsignatureLogId] = useState<any>('') // 签署地址id
  const [contractNo, setcontractNo] = useState('')
  /* 总金额 */
  const [tobidCount, settobidCount] = useState<number | string>(0)
  const [bidAmount, setbidAmount] = useState<number | string>(0)

  const [oldTobidCount, setOldTobidCount] = useState<number | string>(0)
  const [oldBidAmount, setOldBidAmount] = useState<number | string>(0)

  const [btnText, setBtnText] = useState(intl.formatMessage({ id: 'contract.shenhe' }))
  const [tabPane] = useState([
    { key: 'progress', label: intl.formatMessage({ id: 'contract.liuzhuanjindu' }) },
    { key: 'process', label: intl.formatMessage({ id: 'contract.rules.header.info' }) },
    { key: 'associated', label: intl.formatMessage({ id: 'contract.associateInformation' }) },
    { key: 'materials', label: intl.formatMessage({ id: 'contract.caigoucailiao' }) },
    { key: 'conditions', label: intl.formatMessage({ id: 'contract.fukuanjihua' }) },
    { key: 'docking', label: intl.formatMessage({ id: 'contract.contract.info' }) },
    { key: 'versions', label: intl.formatMessage({ id: 'contract.versions' }) },
    { key: 'record', label: intl.formatMessage({ id: 'contract.liuzhuanjilu' }) },
  ])

  const [contractVersionVO, setContractVersionVO] = useState([])

  // const formActions = createFormActions();
  const [associatedDocumentsVisible, setAssociatedDocumentsVisible] = useState<boolean>(false)

  const [lookAssociatedproductNo, setLookAssociatedproductNo] = useState<string>()

  // 采购物料变更数据 前 or 后
  const [isMaterialsNew, setIsMaterialsNew] = useState<boolean>(true)
  const [isContractNew, setIsContractNew] = useState<boolean>(true)

  const [oldContractManageDetailVOData, setOldContractManageDetailVOData] = useState<any>()
  const [current, setcurrent] = useState<number>(1)
  const [oldTatalMaterials, setOldTatalMaterials] = useState<any>(0)
  const [tatalMaterials, setTatalMaterials] = useState<any>(0)

  /** 获取旧的物料列表 */
  const getOldMaterialsData = (params) => {
    getContractManagePagePurchaseMaterielList({
      ...params,
    })
      .then((res) => {
        let tobidCounts: string | number = 0
        let bidAmounts: string | number = 0
        res.data.data.map((item) => {
          tobidCounts = new BigNumber(+tobidCounts).plus(item.bidCount).toNumber().toFixed(3)
          bidAmounts = new BigNumber(+bidAmounts).plus(item.bidAmount).toNumber().toFixed(2)
        })
        setOldTobidCount(tobidCounts)
        setOldBidAmount(bidAmounts)
        setOldListData(res.data.data)
        setOldTatalMaterials(res.data.totalCount)
      })
      .catch(() => {})
  }

  /* 获取详情的数据 */
  const getDetail = () => {
    getContractManageGetDetail({ contractId })
      .then((res) => {
        if (res.code === 1000) {
          const { basics, oldContractManageDetailVO } = res.data
          setsignatureLogId(basics.signatureLogId ? basics.signatureLogId : '')
          const basicInfos: any = {
            col1: [
              {
                label: intl.formatMessage({ id: 'contract.hetongbianhao' }),
                extra: basics.contractNo ? basics.contractNo : '',
                old:
                  oldContractManageDetailVO?.basics?.contractNo &&
                  oldContractManageDetailVO?.basics?.contractNo !== basics.contractNo
                    ? oldContractManageDetailVO?.basics?.contractNo
                    : null,
              },
              {
                label: intl.formatMessage({ id: 'contract.hetongzhaiyao' }),
                extra: basics.contractAbstract ? basics.contractAbstract : '',
                old:
                  oldContractManageDetailVO?.basics?.contractAbstract &&
                  oldContractManageDetailVO?.basics?.contractAbstract !== basics.contractAbstract
                    ? oldContractManageDetailVO?.basics?.contractAbstract
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
                extra: basics.sourceTypeName ? basics.sourceTypeName : '',
              },
              {
                label: intl.formatMessage({ id: 'contract.hetongyouxiaoqi' }),
                extra: `${basics.startTime}${intl.formatMessage({ id: 'common.text.to' })}${basics.endTime}`,
                old:
                  oldContractManageDetailVO?.basics?.startTime &&
                  (oldContractManageDetailVO?.basics?.startTime != basics.startTime ||
                    oldContractManageDetailVO?.basics?.endTime != basics?.endTime)
                    ? `${oldContractManageDetailVO?.basics?.startTime}${intl.formatMessage({
                        id: 'common.text.to',
                      })}${oldContractManageDetailVO?.basics?.endTime}`
                    : null,
              },
              {
                label: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
                extra: basics.innerStatusName ? basics.innerStatusName : '',
              },
              // { label: intl.formatMessage({ id: 'contract.duiyingdanju' }), extra: basics.sourceNo ? basics.sourceNo : '', },
              // { label: intl.formatMessage({ id: 'contract.shoubiaohuiyuan' }), extra: basics.partyBName ? basics.partyBName : '' },
              // { label: intl.formatMessage({ id: 'contract.shoubiaojine' }), extra: basics.totalAmount ? `${intl.formatMessage({ id: 'common.money' })}${basics.totalAmount}` : '' },
            ],
            col3: [],
          }
          const associatedInfos: any = {
            col1: [
              {
                label: intl.formatMessage({ id: 'contract.duiyingdanju' }),
                extra: basics.sourceNo ? basics.sourceNo : '',
              },
              {
                label: intl.formatMessage({ id: 'contract.supplier' }),
                extra: basics.partyBName ? basics.partyBName : '',
              },
            ],
            col2: [
              {
                label: intl.formatMessage({ id: 'contract.currency' }),
                extra: basics.currencyTypeName ? basics.currencyTypeName : '',
                old:
                  oldContractManageDetailVO?.basics &&
                  (basics.currencyTypeName || oldContractManageDetailVO?.basics?.currencyTypeName) &&
                  basics.currencyTypeName != oldContractManageDetailVO?.basics?.currencyTypeName
                    ? oldContractManageDetailVO?.basics?.currencyTypeName
                    : null,
              },
              {
                label: intl.formatMessage({ id: 'contract.contractAmount' }),
                extra: basics.totalAmount ? `${basics.totalAmount}` : '',
                old:
                  oldContractManageDetailVO?.basics &&
                  basics.totalAmount != oldContractManageDetailVO?.basics?.totalAmount
                    ? oldContractManageDetailVO?.basics?.totalAmount
                    : null,
              },
            ],
          }
          if (basics.sourceId) {
            switch (basics.sourceType) {
              case 1: {
                // if (basics.turn && basics.sourceId)
                // associatedInfos.col1[0].url = `/procurementAbility/confirmOffer/offerInquire/preview?id=${basics.sourceId}&turn=${basics.turn}`
                associatedInfos.col1[0].url = `/procurementAbility/offter/offter/preview?id=${basics.sourceId}&numberXJPJ63501=${basics.sourceNo}`
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
          console.log(basicInfos, 'basicInfos', associatedInfos, 'associatedInfos')
          setContractVersionVO(res.data.contractVersionVO)
          setAssociatedInfo(associatedInfos)
          setbasicInfo(basicInfos)
          setStepList(res.data.outerTaskStepList)
          setouterTaskStepList(res.data.outerTaskStepList)
          setinnerTaskStepList(res.data.innerTaskStepList)
          setpayPlanList(res.data.payPlanList)
          setcontractText(res.data?.contractText ? res.data.contractText : {})
          setcontractAbstract(res.data.basics?.contractAbstract)
          setcontractNo(basics.contractNo)
          if (oldContractManageDetailVO) setOldContractManageDetailVOData(oldContractManageDetailVO)

          if (oldContractManageDetailVO?.payPlanList) setOldPayPlanList(oldContractManageDetailVO?.payPlanList)
          if (oldContractManageDetailVO) setoldContractText(oldContractManageDetailVO?.contractText)

          if (oldContractManageDetailVO?.basics.id) {
            const data = {
              current: 1,
              pageSize: 10,
              contractId: oldContractManageDetailVO?.basics.id,
            }
            getOldMaterialsData(data)
          }
        }
      })
      .catch(() => {})
  }

  const onDownload = (file: any) => {
    const url = `/api/contract/signature/downloadPdf`

    const x = new XMLHttpRequest()

    x.open('POST', url, true)
    x.responseType = 'blob'
    x.setRequestHeader('Content-Type', 'application/json')
    x.onload = function () {
      const urls = window.URL.createObjectURL(x.response)
      const a = document.createElement('a')
      a.href = urls
      a.download = file.contractName
      a.click()
    }
    x.send(JSON.stringify({ id: file.id }))
  }

  /**
   * 流转进度点击
   */
  const handleBatchChange = (e, key) => {
    console.log(key)
    if (key == 'Steps') {
      const StepLists = e.target.value == 1 ? outerTaskStepList : innerTaskStepList
      setCurrentBatch(e.target.value)
      setStepList(StepLists)
      return
    } else {
      setlistIndex(e.target.value)
    }
  }

  /*查询合同详情-分页查询合同采购物料*/
  const columns: any = [
    {
      title: intl.formatMessage({ id: 'contract.wuliaobianhaomingcheng' }),
      dataIndex: 'materielNo',
      render: (text, item) => {
        return (
          <div>
            <p> {text}</p>
            <p>{item.materielName}</p>
          </div>
        )
      },
    },
    { title: intl.formatMessage({ id: 'contract.guigexinghao' }), dataIndex: 'type' },
    { title: intl.formatMessage({ id: 'contract.pinlei' }), dataIndex: 'category' },
    { title: intl.formatMessage({ id: 'contract.pinpai' }), dataIndex: 'brand' },
    { title: intl.formatMessage({ id: 'contract.danwei' }), dataIndex: 'unit' },
    { title: intl.formatMessage({ id: 'contract.inquiry.number' }), dataIndex: 'purchaseCount' },
    { title: intl.formatMessage({ id: 'contract.hanshui' }), dataIndex: 'isHasTaxName' },
    {
      title: intl.formatMessage({ id: 'contract.shuil' }),
      dataIndex: 'taxRate',
      render: (text) => {
        return <div>{text}%</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.danjiahanshui' }),
      dataIndex: 'price',
      render: (text) => {
        return (
          <div>
            {/* {intl.formatMessage({ id: 'common.money' })} */}
            {text}
          </div>
        )
      },
    },
    {
      dataIndex: 'bidCount',
      title: () => {
        return (
          <Space direction="vertical">
            <Text>{intl.formatMessage({ id: 'contract.quantity' })}</Text>
            <Text>
              {intl.formatMessage({ id: 'contract.heji' })}: {isMaterialsNew ? tobidCount : oldTobidCount}
            </Text>
          </Space>
        )
      },
      render: (text) => {
        return <div>{text}</div>
      },
    },
    {
      dataIndex: 'bidAmount',
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.hetongjinehanshui' })}</Text>
          <Text>
            {intl.formatMessage({ id: 'contract.heji' })}:{isMaterialsNew ? bidAmount : oldBidAmount}
          </Text>
        </Space>
      ),
      render: (text) => {
        return (
          <div>
            {/* {intl.formatMessage({ id: 'common.money' })} */}
            {text}
          </div>
        )
      },
    },
    {
      dataIndex: 'guanlianqinggoudan',
      title: intl.formatMessage({ id: 'contract.guanliandanju' }),
      render: (text, record) => {
        return record.requisitionList?.length ? (
          <Button
            type="link"
            onClick={() => {
              const prpIds = record.requisitionList.map((item) => item.detailId)
              setLookAssociatedproductNo(prpIds.toString())
              setAssociatedDocumentsVisible(true)
            }}
          >
            {intl.formatMessage({ id: 'contract.guanlianqinggoudan' })}
          </Button>
        ) : null
      },
    },
  ]
  const fetchListData = (params) => {
    getContractManagePagePurchaseMaterielList({
      ...params,
      contractId,
    })
      .then((res) => {
        let tobidCounts: string | number = 0
        let bidAmounts: string | number = 0
        res.data.data.map((item) => {
          tobidCounts = new BigNumber(+tobidCounts).plus(item.bidCount).toNumber().toFixed(3)
          bidAmounts = new BigNumber(+bidAmounts).plus(item.bidAmount).toNumber().toFixed(2)
        })
        settobidCount(tobidCounts)
        setbidAmount(bidAmounts)
        setListData(res.data.data)
        setTatalMaterials(res.data.totalCount)
        // setassociatedCategory(res.data.data[0].setassociatedCategory)
      })
      .catch(() => {})
  }

  // 展开/收起的回调
  // const onExpand = expandedKeys => {
  // };
  useEffect(() => {
    const text =
      type == 'Signacontract'
        ? intl.formatMessage({ id: 'contract.qiandinghetong' })
        : intl.formatMessage({ id: 'contract.shenhe' })
    setBtnText(text)
    setTargetOffset(window.innerHeight / 6)
    getDetail()
    const data = {
      current: 1,
      pageSize: 10,
    }
    fetchListData(data)
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
  /* 下拉的子元素 */
  const listItem = (record) => (
    <div className={style.listItem}>
      <div className={style.label}>
        <p>{intl.formatMessage({ id: 'contract.guanlian' })}</p>
        <p>{intl.formatMessage({ id: 'contract.baojiashangpin' })}</p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.shangpinID' })}：{record.associatedDataId}
        </p>
        <p className={style.nowrap}>
          {intl.formatMessage({ id: 'contract.shangpinmingcheng' })}：{record.associatedGoods}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.guigexinghao' })}：{record.associatedType}
        </p>
        <p>
          {intl.formatMessage({ id: 'contract.pinlei' })}：{record.associatedCategory}
        </p>
      </div>
      <div className={style.text}>
        <p>
          {intl.formatMessage({ id: 'contract.pinpai' })}：{record.associatedBrand}
        </p>
      </div>
    </div>
  )

  /* 提交审核的回调 */
  const getfetchData = (data) => {
    if (data.code === 1000) {
      history.goBack()
    }
    setIsModalVisible(data.ExamineFlag)
    // return;
    // if (data.code === 1000) {
    //   ref.current.reloadCurrent()
    //   setTimeout(() => {
    //     history.goBack()
    //   }, 500)
    // } else {
    //   history.goBack()
    // }
  }
  /* 提交表单 */
  const submitExamine = async () => {
    if (type === 'Signacontract' && contractText.isUseElectronicContract == 1) {
      const ress = await getContractSignatureGetHandSignatureUrl({ signatureLogId })
      if (ress.code == 1000) {
        window.open(ress.data.url)
        let timer = setInterval(() => {
          getContractSignatureGetSignatorySignStatus({ signatureLogId }).then((res) => {
            console.log(res, 'resres')
            if (res.code === 1000) {
              const arr = [2, 3, 4]
              if (arr.includes(res.data.signResult)) {
                clearInterval(timer)
                timer = null
                let isPass
                if (res.data.signResult === 2) {
                  isPass = 1
                } else if (res.data.signResult === 4) {
                  isPass = 0
                } else if (res.data.signResult === 3) {
                  return
                }
                postContractManageSign({
                  contractId,
                  isPass,
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
  }

  const getTable = (params) => {
    const { ...rest } = params
    return new Promise((resolve, reject) => {
      getContractPurchaseRequisitionPageByProductIds({
        ...rest,
        prpIdsStr: lookAssociatedproductNo || '',
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  const stepCurrent = StepList.reduce((prev, cur) => {
    return prev + cur.isExecute
  }, -1)

  const handlePaginationChange = (currents: number) => {
    const datas: any = {
      current: currents,
      pageSize: 10,
    }
    setcurrent(currents)

    if (isMaterialsNew) {
      fetchListData(datas)
    } else {
      datas.contractId = oldContractManageDetailVOData?.basics.id
      getOldMaterialsData(datas)
    }
  }

  return (
    <div className={style.anchorWrap}>
      <PageHeaderWrapper
        backDom
        items={tabPane}
        extra={
          showExamineBtn && (
            <div className="btn" style={{ marginRight: '20px' }}>
              <Button type="primary" onClick={() => submitExamine()}>
                {btnText}
              </Button>
            </div>
          )
        }
      >
        <Space direction="vertical" style={{ width: '100%', display: 'flex' }}>
          {/* 流转进度 */}
          <Card
            id="progress"
            title={intl.formatMessage({ id: 'contract.liuzhuanjindu' })}
            extra={
              <Radio.Group defaultValue={currentBatch} onChange={(e) => handleBatchChange(e, 'Steps')}>
                <Radio.Button value="1">{intl.formatMessage({ id: 'contract.waibuliuzhuan' })}</Radio.Button>
                <Radio.Button value="2">{intl.formatMessage({ id: 'contract.neibuliuzhuan' })}</Radio.Button>
              </Radio.Group>
            }
          >
            <Steps progressDot current={stepCurrent}>
              {StepList.map((item: any) => (
                <Step
                  title={item.taskName}
                  description={item.roleName}
                  // status={item.isExecute == 1 ? 'finish' : 'wait'}
                />
              ))}
            </Steps>
          </Card>
          {/* 基本信息 */}
          <Basic basicInfo={basicInfo} />

          {/* 关联信息 */}
          <Associated associatedInfo={associatedInfo} />

          {/* 采购材料 */}
          <Card
            id="materials"
            title={intl.formatMessage({ id: 'contract.hetongcaigoucailiao' })}
            extra={
              oldListData?.length ? (
                <div className={style.changeBtn}>
                  <div
                    className={cx(style.btn, !isMaterialsNew ? style.active : '')}
                    onClick={() => {
                      setIsMaterialsNew(false)
                      setcurrent(1)
                      const data = {
                        current: 1,
                        pageSize: 10,
                        contractId: oldContractManageDetailVOData?.basics.id,
                      }
                      getOldMaterialsData(data)
                    }}
                  >
                    {translate('web.resource.member.biangengqian')}
                  </div>
                  <div
                    className={cx(style.btn, isMaterialsNew ? style.active : '')}
                    onClick={() => {
                      setIsMaterialsNew(true)
                      setcurrent(1)
                      const data = {
                        current: 1,
                        pageSize: 10,
                        contractId: contractId,
                      }
                      fetchListData(data)
                    }}
                  >
                    {translate('web.resource.member.biangenghou')}
                  </div>
                </div>
              ) : null
            }
          >
            <div className={style.box}>
              <Table
                columns={columns}
                rowKey="id"
                expandable={{
                  expandedRowRender: (record) => listItem(record),
                  // onExpand: record => onExpand(record)
                }}
                dataSource={isMaterialsNew ? ListData : oldListData}
                style={{
                  width: '100%',
                }}
                pagination={{
                  current: current,
                  pageSize: 10,
                  showSizeChanger: false,
                  total: isMaterialsNew ? tatalMaterials : oldTatalMaterials,
                  onChange: handlePaginationChange,
                }}
              />
            </div>
          </Card>
          {/* 付款计划 */}
          <PaymentCard
            IsShow={false}
            payPlanList={payPlanList}
            basics={basicInfo}
            contractId={contractId}
            oldPayPlanList={oldPayPlanList}
          />
          {/* 合同信息 */}
          <Card
            id="docking"
            title={intl.formatMessage({ id: 'contract.contract.info' })}
            extra={
              oldContractText && oldContractText.contractUrl != contractText?.contractUrl ? (
                <div className={style.changeBtn}>
                  <div
                    className={cx(style.btn, !isContractNew ? style.active : '')}
                    onClick={() => setIsContractNew(false)}
                  >
                    {translate('web.resource.member.biangengqian')}
                  </div>
                  <div
                    className={cx(style.btn, isContractNew ? style.active : '')}
                    onClick={() => setIsContractNew(true)}
                  >
                    {translate('web.resource.member.biangenghou')}
                  </div>
                </div>
              ) : null
            }
          >
            {(isContractNew ? contractText?.contractName : oldContractText?.contractName) ? (
              <div className={style.upload_item} style={{ width: 680 }}>
                <div className="ant-card-head-wrapper">
                  {(isContractNew ? contractText.isUseElectronicContract : oldContractText?.isUseElectronicContract)
                    ? intl.formatMessage({ id: 'contract.dianzihetong' })
                    : intl.formatMessage({ id: 'contract.zhizhihetong' })}
                </div>
                <div
                  className={style.upload_left}
                  onClick={() => onDownload(isContractNew ? contractText : oldContractText)}
                  style={{ width: 600, cursor: 'pointer' }}
                >
                  <FileWordFilled />
                  <span>{isContractNew ? contractText.contractName : oldContractText.contractName}</span>
                </div>
              </div>
            ) : null}
          </Card>

          {/* 合同版本 */}
          <Card id="versions" title={intl.formatMessage({ id: 'contract.versions' })}>
            <ContractVersions contractId={contractId} contractVersionVO={contractVersionVO} />
          </Card>
          {/* 流转记录 */}
          <Card
            id="record"
            title={intl.formatMessage({ id: 'contract.liuzhuanjilu' })}
            extra={
              <Radio.Group defaultValue={listIndex} onChange={(e) => handleBatchChange(e, 'list')}>
                <Radio.Button value="1">{intl.formatMessage({ id: 'contract.waibuliuzhuan' })}</Radio.Button>
                <Radio.Button value="2">{intl.formatMessage({ id: 'contract.neibuliuzhuan' })}</Radio.Button>
              </Radio.Group>
            }
          >
            <TableList contractId={contractId} listIndex={listIndex} />
          </Card>
        </Space>
      </PageHeaderWrapper>
      <ExamineFrom
        ExamineFlag={Visible}
        getfetchData={getfetchData}
        applyId={contractId}
        type={type}
        agreeText={
          type == 'Signacontract'
            ? intl.formatMessage({ id: 'contract.tongyiqianding' })
            : intl.formatMessage({ id: 'contract.tongguo' })
        }
        disagree={
          type == 'Signacontract'
            ? intl.formatMessage({ id: 'contract.butongyiqianding' })
            : intl.formatMessage({ id: 'contract.butongguo' })
        }
      />

      <ModalTable
        cancel={() => setAssociatedDocumentsVisible(false)}
        visible={associatedDocumentsVisible}
        width={1200}
        columns={purchasecolumns}
        modalTitle={intl.formatMessage({ id: 'contract.guanlianqinggoudan' })}
        fetchTableData={(params) => getTable(params)}
        rowKey={'rowId'}
        resetModal={{ destroyOnClose: true, forceRender: false, footer: null }}
      />
    </div>
  )
}
export default Details
