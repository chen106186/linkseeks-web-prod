import React, { useState, useRef, useEffect } from 'react'
import { Button, Card, Tabs, message, Form } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import Information from './components/Information'
import FormList from './components/FormList'
import Fromtable from './components/Fromtable'
import ContractText from './components/ContractText'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { SaveOutlined } from '@ant-design/icons'
import { postContractManageSave } from '@apps/apis'
import BigNumber from 'bignumber.js'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useWebIntl } from '@apps/locales'
const intl = getIntl()

const { TabPane } = Tabs
const Add: React.FC<{}> = (props: any) => {
  const { state } = useLocation()
  const _state: any = state
  const [form] = Form.useForm()
  const [payForm] = Form.useForm()
  const { sourceType, sourceWay } = useQuery()
  const currentBasic = useRef<any>({})
  const purchaseMate = useRef<any>([])
  const payPlan = useRef<any>([])
  const contractText = useRef<any>({})
  const translate = useWebIntl()
  /**
   * @param name tag标签名
   * @param components 显示内容
   */
  const [basic, setbasic] = useState<any>({})
  const [purchaseMaterielList, setpurchaseMaterielList] = useState<any>({})
  const [payPlanList, setpayPlanList] = useState<any>([])
  const [type, setType] = useState<any>('1')
  const [Price, setPrice] = useState(0) // 合同总金额
  const [tabKey, setTabKey] = useState<number>(0)
  /* 初始值 */
  const [Row, setRow] = useState<any>({})

  const [memberId, setmemberId] = useState<string>('')
  const [roleId, setroleId] = useState<string>('')
  const [basicsVO, setbasicsVO] = useState<any>({})
  const [currency, setCurrency] = useState<any>({})
  /* 获取下拉框选中的id 查询物料 */
  const getrow = (row) => {
    let price = row.awardAmount ? row.awardAmount : row.bidWinnerAmount ? row.bidWinnerAmount : 0
    console.log(price, '10000')
    setPrice(price)
    setRow(row)
  }

  /* 获取供应商角色id */
  const getmemberId = (memberId) => {
    setmemberId(memberId)
  }
  /* 采购商会员关联id */
  const getroleId = (roleId) => {
    setroleId(roleId)
  }

  const getbasicsVO = (basicsVO) => {
    setbasicsVO(basicsVO)
  }
  const getcurrency = (Currency) => {
    setCurrency(Currency)
  }
  /* 设置选中值 */
  const getsourceType = (type) => {
    console.log(type)
    setType(type)
  }

  const TabList = [
    {
      name: intl.formatMessage({ id: 'contract.jibenxinxi' }),
      components: (
        <Information
          fetchdata={basic}
          currentRef={currentBasic}
          Row={Row}
          sourceType={sourceType}
          getrow={getrow}
          getmemberId={getmemberId}
          getsourceType={getsourceType}
          getbasicsVO={getbasicsVO}
          getroleId={getroleId}
          getcurrency={getcurrency}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'contract.caigouwuliao' }),
      components: (
        <FormList
          form={form}
          fetchdata={purchaseMaterielList}
          currentRef={purchaseMate}
          Row={Row}
          sourceWay={sourceWay}
          sourceType={type}
          totalAmountChange={(num) => setPrice(num)}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'contract.fukuanjihua' }),
      components: <Fromtable fetchdata={payPlanList} currentRef={payPlan} Price={Price} form={payForm} />,
    },
    {
      name: intl.formatMessage({ id: 'contract.hetongwenben' }),
      components: (
        <ContractText
          currentRef={contractText}
          memberId={memberId}
          roleId={roleId}
          currency={currency}
          basicsVO={basicsVO}
          purchaseMate={purchaseMate}
          Price={Price}
        />
      ),
    },
  ]
  /* 提交*/
  const submit = async () => {
    /* 基本信息 */
    const basicsVO = await currentBasic.current.get()
    let totalAmount = 0
    let nowTotal = 0
    if (basicsVO.data.sourceId == undefined || basicsVO.data.sourceId == '') {
      delete basicsVO.data.sourceId
    }
    // 后端定义：如果请购单，sourceId 传1
    if (basicsVO?.data?.sourceType == 4) basicsVO.data.sourceId = 1

    if (basicsVO.data.sourceNo == undefined || basicsVO.data.sourceNo == '') {
      delete basicsVO.data.sourceNo
    }
    /* 选择物料 */
    const purchaseMaterielList = (await purchaseMate.current.length) != 0 ? await purchaseMate.current.get() : []

    if (purchaseMaterielList.length != 0) {
      purchaseMaterielList.data.list.map((item) => {
        // totalAmount = totalAmount + Number(item.bidAmount)
        totalAmount = new BigNumber(+totalAmount).plus(item.bidAmount).toNumber()
      })
      console.log(purchaseMaterielList, totalAmount)
      if (basicsVO.sourceType == 4) {
        basicsVO.data.totalAmount = totalAmount
      } else {
        basicsVO.data.totalAmount = basicsVO.data.totalAmount ? basicsVO.data.totalAmount : totalAmount
      }
    }
    /* 付款方式 */
    const payPlanList = (await payPlan.current.length) != 0 ? await payPlan.current.get() : []
    /* 合同管理 */
    const contract = (await Object.keys(contractText.current).length) != 0 ? await contractText.current.get() : {}

    try {
      const payValue = await payForm.validateFields()
      let param: any = {
        roleId: basicsVO.data.partyBRoleId,
        basicsVO: basicsVO.data,
        purchaseMaterielList: purchaseMaterielList?.data?.list,
        payPlanList: payPlanList,
        contractText: contract,
        operateType: 1,
      }
      if (!(Array.isArray(param.payPlanList) && param.payPlanList.length > 0)) {
        // 付款计划必须填写
        message.error(translate('web.resource.contract.requirefukuan'))
        return
      }
      form
        .validateFields()
        .then(() => {
          // 518需求 合同非必填 不验证生成电子合同
          if (!contract.contractFlag && contract.isUseElectronicContract == 1) {
            message.info(intl.formatMessage({ id: 'contract.qingxiancaozuoshengchengdian' }))
          } else {
            postContractManageSave(param).then((res) => {
              if (res.code === 1000) {
                setTimeout(() => {
                  history.push('/contract/manage/addList')
                }, 1000)
              }
            })
          }
        })
        .catch(() => {
          message.info(intl.formatMessage({ id: 'contract.qingshurucaigouwuliao' }))
          return
        })
    } catch (err) {
      console.log(err)
      message.info(intl.formatMessage({ id: 'contract.qingshurufukuanjihua' }))
      return
    }
  }

  useEffect(() => {
    if (sourceType) {
      setType(sourceType)
      let res = JSON.parse(sessionStorage.getItem('record'))
      setRow(res)
      setPrice(res?.totalAmount)
      const memberId = res?.partyBMemberId
      setmemberId(memberId)
      setroleId(res?.partyBRoleId)
    }

    //需求池转入
    if (_state?.demandPoolData || _state?.demandPoolRows) {
      setType(4)
    }
  }, [])

  const handleTabChange = (i) => {
    if (i == 2 && !Price) {
      message.error('请选择物料并添加价格')
      return
    }
    setTabKey(i)
  }

  return (
    <PageHeaderWrapper
      onBack={() => history.goBack()}
      title={intl.formatMessage({ id: 'contract.xinjianhetong' })}
      extra={[
        <Button key="1" type="primary" icon={<SaveOutlined />} onClick={() => submit()}>
          {' '}
          {intl.formatMessage({ id: 'contract.baocun' })}
        </Button>,
      ]}
    >
      <Card>
        <Tabs
          activeKey={String(tabKey)}
          defaultActiveKey="0"
          type="card"
          size="small"
          onChange={(e) => handleTabChange(e)}
        >
          {TabList.map((item, index) => (
            <TabPane tab={item.name} key={index}>
              {item.components}
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Add
