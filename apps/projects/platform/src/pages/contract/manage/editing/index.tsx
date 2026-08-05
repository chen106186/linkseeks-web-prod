import React, { useState, useRef, useEffect } from 'react'
import { Button, Card, Tabs, Form, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Information from './components/Information'
import FormList from './components/FormList'
import Fromtable from './components/Fromtable'
import ContractText from './components/ContractText'
import ContractVersions from '../../components/ContractVersions'
import ContractTransferRecord from './components/ContractTransferRecord'
import { useQuery } from '@linkseeks/router-core'
import { SaveOutlined } from '@ant-design/icons'
import {
  getContractManageGetDetail,
  getContractManagePagePurchaseMaterielList,
  postContractManageSave,
} from '@apps/apis'
// import { getContractManageGetDetail, getContractManagePagePurchaseMaterielList, postContractManageSave } from '@apps/apis'
import { AuthButton } from '@apps/components'
import BigNumber from 'bignumber.js'
import { useWebIntl } from '@apps/locales'
const intl = getIntl()
const { TabPane } = Tabs
const Editing: React.FC<{}> = (props: any) => {
  const [form] = Form.useForm()
  const [payForm] = Form.useForm()
  const {
    contractId, // 寻源类型
    oldContractId,
  } = useQuery()
  const translate = useWebIntl()
  const currentBasic = useRef<any>({})
  const purchaseMate = useRef<any>([])
  const payPlan = useRef<any>([])
  const contractText = useRef<any>({})
  const [btnType, setbtnType] = useState<any>(false)
  const [Price, setPrice] = useState(0) // 合同总金额
  const [tabKey, setTabKey] = useState<number>(0)
  /**
   * @param name tag标签名
   * @param components 显示内容
   */
  const [basic, setbasic] = useState<any>({})
  const [purchaseMaterielList, setpurchaseMaterielList] = useState<any>([])
  const [payPlanList, setpayPlanList] = useState<any>([])
  const [ctText, setcontractText] = useState<any>({})
  const [roleId, setroleId] = useState<string>('')
  const [basicsVO, setbasicsVO] = useState<any>({})
  const [currency, setCurrency] = useState<any>({})
  const [picker, setpicker] = useState<any>({})
  //合同版本
  const [contractVersionVO, setContractVersionVO] = useState([])

  /* 查询详情 */
  const getDetail = () => {
    getContractManageGetDetail({ contractId })
      .then((res) => {
        if (res.code === 1000) {
          console.log(res)
          const { basics } = res.data
          setbasic(basics)
          setPrice(basics.totalAmount)
          setpayPlanList(res.data?.payPlanList)
          setcontractText(res.data?.contractText)
          setContractVersionVO(res.data?.contractVersionVO)
        }
      })
      .catch(() => {})
  }
  /* 查询购物料 */
  const getMaterielList = () => {
    getContractManagePagePurchaseMaterielList({
      current: '1',
      pageSize: '999',
      contractId,
    })
      .then((res) => {
        if (res.code === 1000) {
          const data = res.data.data
          data.map((i: any) => {
            const prpIds = []
            if (i.requisitionList?.length) {
              i.requisitionList.map((item) => {
                prpIds.push(item.detailId)
              })
            }
            i.prpIds = prpIds
          })
          setpurchaseMaterielList(data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getDetail()
    getMaterielList()
  }, [])

  /* 提交*/
  const submit = async () => {
    if (!btnType) {
      /* 基本信息 */
      let totalAmount = 0
      const basicsVOs = await currentBasic.current.get()
      const purchaseMaterielLists = (await purchaseMate.current.length) != 0 ? await purchaseMate.current.get() : []
      const payPlanLists = (await payPlan.current.length) != 0 ? await payPlan.current.get() : []
      const contract = (await Object.keys(contractText.current).length) != 0 ? await contractText.current.get() : {}

      purchaseMaterielLists.data.list.map((item) => {
        // totalAmount = totalAmount + Number(item.bidAmount)
        totalAmount = new BigNumber(+totalAmount).plus(item.bidAmount).toNumber()
      })

      if (basicsVOs.data.sourceType == 4 || basicsVOs.data.sourceType == 5) {
        basicsVOs.data.totalAmount = totalAmount
      } else {
        basicsVOs.data.totalAmount = basicsVOs.data.totalAmount ? basicsVOs.data.totalAmount : totalAmount
      }

      const param: any = {
        basicsVO: basicsVOs.data,
        purchaseMaterielList:
          purchaseMaterielLists.length != 0 ? purchaseMaterielLists.data.list : purchaseMaterielLists,
        payPlanList: payPlanLists,
        contractText: contract,
        operateType: oldContractId ? 3 : 2,
      }

      console.log(param)
      if (!(Array.isArray(param.payPlanList) && param.payPlanList.length > 0)) {
        // 付款计划必须填写
        message.error(translate('web.resource.contract.requirefukuan'))
        return
      }
      setbtnType(true)

      try {
        await payForm.validateFields()

        form
          .validateFields()
          .then(() => {
            postContractManageSave(param)
              .then((res) => {
                if (res.code === 1000) {
                  setTimeout(() => {
                    history.push('/contract/manage/addList')
                    setbtnType(false)
                  }, 1000)
                } else {
                  setbtnType(false)
                }
              })
              .catch((err) => {
                console.log(err)
                setbtnType(false)
              })
          })
          .catch(() => {
            message.info(intl.formatMessage({ id: 'contract.qingshurucaigouwuliao' }))
            setbtnType(false)
            return
          })
      } catch (err) {
        console.log(err)
        message.info(intl.formatMessage({ id: 'contract.qingshurufukuanjihua' }))
        setbtnType(false)
        return
      }
    }
  }

  const getbasicsVO = (basicsVOs) => {
    setbasicsVO(basicsVOs)
  }
  /* 采购商会员关联id */
  const getroleId = (roleIds) => {
    setroleId(roleIds)
  }

  const getcurrency = (Currency) => {
    setCurrency(Currency)
  }
  const getPicker = (time) => {
    setpicker(time)
  }
  const TabList = [
    {
      name: intl.formatMessage({ id: 'contract.jibenxinxi' }),
      components: (
        <Information
          currentRef={currentBasic}
          basic={basic}
          oldContractId={oldContractId}
          getbasicsVO={getbasicsVO}
          getroleId={getroleId}
          getcurrency={getcurrency}
          getPicker={getPicker}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'contract.caigouwuliao' }),
      components: (
        <FormList
          form={form}
          sourceType={basic.sourceType}
          currentRef={purchaseMate}
          purchaseMaterielList={purchaseMaterielList}
          totalAmountChange={(num) => setPrice(num)}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'contract.fukuanjihua' }),
      components: <Fromtable currentRef={payPlan} payPlanList={payPlanList} Price={Price} form={payForm} />,
    },
    {
      name: intl.formatMessage({ id: 'contract.hetongwenben' }),
      components: (
        <ContractText
          currentRef={contractText}
          ctText={ctText}
          memberId={basic.partyBMemberId}
          roleId={roleId}
          currency={currency}
          basicsVO={basicsVO}
          purchaseMate={purchaseMate}
          picker={picker}
          Price={Price}
        />
      ),
    },
    {
      name: intl.formatMessage({ id: 'contract.versions' }),
      components: <ContractVersions contractId={contractId} contractVersionVO={contractVersionVO} />,
    },
    {
      name: intl.formatMessage({ id: 'contract.receipts.transferRecord' }),
      components: <ContractTransferRecord contractId={contractId} />,
    },
  ]

  const handleTabChange = (i) => {
    if (i == 2 && !Price) {
      message.error('请选择物料并添加价格')
      return
    }
    setTabKey(i)
  }

  return (
    <PageHeaderWrapper
      title={
        oldContractId
          ? intl.formatMessage({ id: 'contract.hetongbiangeng' })
          : intl.formatMessage({ id: 'contract.bianjihetong' })
      }
      extra={[
        // <AuthButton type="custom" code={oldContractId ? 'update2' : 'edit'}>
        <Button key="1" type="primary" icon={<SaveOutlined />} onClick={() => submit()}>
          {' '}
          {intl.formatMessage({ id: 'contract.baocun' })}
        </Button>,
        // </AuthButton>,
      ]}
    >
      <Card>
        <Tabs
          defaultActiveKey="0"
          type="card"
          size="small"
          activeKey={String(tabKey)}
          onChange={(e) => handleTabChange(e)}
        >
          {TabList.map((item, index) => (
            <TabPane tab={item.name} key={index} forceRender>
              {item.components}
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Editing
