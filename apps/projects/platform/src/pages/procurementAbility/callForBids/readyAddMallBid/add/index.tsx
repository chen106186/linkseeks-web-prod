import React, { useRef, useState, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Card, message, Tooltip, Switch } from 'antd'
import { createAsyncFormActions, createFormActions } from '@apps/formily'
import { SaveOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { ReadyAddBidDetailContext } from '../../../_public/bid/context'
import { mergeAllSchemas } from './schema'
import { useMaterialTable } from './model/useMaterialTable'
import { inviteMemberColumns, paramsConversionFn, paramsRenderFn } from './constant'
import PublicBidModal from './components/publicBidModal'
import RelevanceGoodDrawer from './components/relevanceGoodDrawer'
import MemberModal from './components/memberModal'
import { useAttachmentChangeForEdit } from './effects'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { INVITE_BID, PUBLIC_BID, SYSTEM_BID } from '@/constants/procurement'
import {
  getPurchaseInviteTenderGetInviteTender,
  getPurchaseTemplateGetTemplateList,
  postPurchaseInviteTenderCopyInviteTender,
  postPurchaseInviteTenderSaveOrUpdateInviteTender,
} from '@apps/apis'
import { getLogisticsSelectListReceiverAddress } from '@apps/apis'
import { getCommodityShopListEnterpriseShopBySite } from '@apps/apis'

const intl = getIntl()

export interface AddNewBidProps {}

const addSchemaAction = createFormActions()
const drawerSchemaAction = createAsyncFormActions()

const dataIdList = [
  {
    title: intl.formatMessage({ id: 'detail.purchase.basicLayout' }),
    idName: 'basicInfo',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }),
    idName: 'amount',
  },
  {
    title: intl.formatMessage({ id: 'detail.purchase.files' }),
    idName: 'file',
  },
]

// 新增招标. 包含新增和编辑. 还有复制招标跳转过来的数据回显
const AddNewBid: React.FC<AddNewBidProps> = (props) => {
  const publicRef = useRef<any>({})
  const goodRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const { pageStatus, id } = usePageStatus()
  const [initFormValue, setInitFormValue] = useState<any>({})
  const publicFlag = useRef<boolean>(false)
  const hadMembers = useRef<any>([])
  const [shopInfo, setShopInfo] = useState<Array<any>>([])

  /** 查询当前站点下企业商城类型的商城 */
  const getMallInfo = () => {
    getCommodityShopListEnterpriseShopBySite({ siteId: import.meta.env.OUT_SITEID }).then((res) => {
      setShopInfo(res.data)
    })
  }

  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getPurchaseInviteTenderGetInviteTender({
        inviteTenderId: id,
      }).then((res) => {
        const { data } = res
        setInitFormValue(paramsRenderFn(data))
        hadMembers.current = data.memberList
        setFormLoading(false)
      })
    }
    getMallInfo()
    // 取本地存储中的复制id
    const currentCopyId = Number(sessionStorage.getItem('currentCopyId'))
    if (currentCopyId) {
      postPurchaseInviteTenderCopyInviteTender({ id: currentCopyId }).then((res) => {
        const { data } = res
        setInitFormValue(paramsRenderFn(data))
      })
    }
    return () => sessionStorage.removeItem('currentCopyId')
  }, [])

  const { materialAddButton, materialColumns, materialComponents, ...sectionProps } = useMaterialTable(
    addSchemaAction,
    goodRef,
    drawerSchemaAction,
  )

  const onChangeState = (v, r, i) => {
    const originData = addSchemaAction.getFieldValue('memberList')
    addSchemaAction.setFieldValue(
      'memberList',
      originData.map((item, indx) => {
        if (item.memberId === r.memberId) {
          return { ...item, isSend: v }
        } else {
          return item
        }
      }),
    )
  }

  const handleSubmit = async (value) => {
    setBtnLoading(true)
    const params = paramsConversionFn(value)
    if (!params.isQualificationCheck) {
      delete params.preCheckStartTime
      delete params.preCheckEndTime
    }

    if (!(params.inviteTenderStartTime > params.registerEndTime)) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message1' }))
    }
    if (params.isQualificationCheck && !(params.inviteTenderStartTime > params.preCheckEndTime)) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message2' }))
    }
    if (!(params.openTenderTime >= params.inviteTenderEndTime && params.openTenderTime < params.evaluationStartTime)) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message3' }))
    }
    if (!(params.registerEndTime < params.inviteTenderStartTime)) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message4' }))
    }
    if (
      params.isQualificationCheck &&
      !(params.preCheckStartTime >= params.registerEndTime && params.preCheckStartTime < params.inviteTenderStartTime)
    ) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message5' }))
    }
    if (!(params.evaluationStartTime > params.openTenderTime)) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message6' }))
    }
    if (!params.materielList.length) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message7' }))
    }
    // if(!(params.registerStartTime < moment().format())) {
    //   setBtnLoading(false)
    //   return message.error('报名开始时间大于当前时间')
    // }

    if (id) {
      params['id'] = id
    }
    //  else {
    //   // 新增或复制 剔除id操作
    //   omitID(params)
    // }
    try {
      addSchemaAction.getFieldState('deliverAddressId', (state) => {
        if (params?.deliverAddressId) {
          params['deliverAddress'] = state.props.enum.filter((item) => item['value'] === params['deliverAddressId'])[0][
            'label'
          ]
        }
      })
      addSchemaAction.getFieldState('templateId', (state) => {
        if (params?.templateId) {
          const filtered = state.props.enum.filter((item) => item['value'] === params['templateId'])[0]
          if (filtered['label']) {
            params['templateId'] = filtered['value']
          }
        }
      })
      // 转换品类字符
      addSchemaAction.getFieldState('materielList', (state) => {
        if (params.materielList.length) {
          params['materielList'] = state.value.map((item) => ({
            ...item,
            categoryId: item.categoryId.map((item) => `|${item}|`).join(),
          }))
        }
      })
      params.shopType = 1

      let res = await postPurchaseInviteTenderSaveOrUpdateInviteTender(params)
      if (res.code === 1000) {
        history.goBack()
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      return message.error(intl.formatMessage({ id: 'detail.purchase.message8' }))
    }
  }

  const omitID = (element) => {
    // 数组 遍历剔除id
    if (Array.isArray(element)) {
      element.forEach((e, i) => {
        if (Object.prototype.hasOwnProperty.call(e, 'id')) {
          delete e.id
        }
        omitID(e)
      })
    }
    // 对象遍历 移除外层id
    else if (element && typeof element === 'object') {
      for (const key in element) {
        if (Object.prototype.hasOwnProperty.call(element, key)) {
          if (key === 'id') delete element[key]
          // 如果key值为数组
          const item = element[key]
          if (Array.isArray(item)) {
            omitID(item)
          }
        }
      }
    }
  }

  const providerValue = {
    // detailData: initFormValue,
    schemaActions: addSchemaAction,
  }

  const help = (text: string, desc: string) => (
    <>
      {text}&nbsp;
      <Tooltip title={desc}>
        <QuestionCircleOutlined />
      </Tooltip>
    </>
  )

  const clickAddMember = () => {
    memberRef.current.setVisible(true)
    // if (id) {
    //   memberRef.current.rowSelectionCtl.setSelectedRowKeys(hadMembers.current.map(item => item.memberId))
    //   memberRef.current.rowSelectionCtl.setSelectRow(hadMembers.current)
    // }
  }

  // 招标方式邀请添加
  const inviteAddButton = (
    <Button onClick={clickAddMember} style={{ marginBottom: 16 }} block icon={<PlusOutlined />} type="dashed">
      {intl.formatMessage({ id: 'detail.purchase.select' })}
    </Button>
  )

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'detail.purchase.message9' }))
      return Promise.reject()
    }
  }

  const fetchTemplateSelectOptions = async () => {
    const { data } = await getPurchaseTemplateGetTemplateList({ current: '1', pageSize: '999', status: 'true' })
    return data.data.map((v) => ({ label: v.name, value: v.id }))
  }

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={
        pageStatus === PageStatus.ADD
          ? intl.formatMessage({ id: 'table.purchase.xjsczb' })
          : intl.formatMessage({ id: 'table.purchase.bjsczb' })
      }
      extra={[
        <Button
          key="1"
          onClick={() => addSchemaAction.submit()}
          loading={btnLoading}
          type="primary"
          icon={<SaveOutlined />}
        >
          {intl.formatMessage({ id: 'detail.purchase.save' })}
        </Button>,
      ]}
    >
      <ReadyAddBidDetailContext.Provider value={providerValue}>
        <Card>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            // editable={pageStatus !== PageStatus.PREVIEW}
            value={initFormValue}
            actions={addSchemaAction}
            schema={mergeAllSchemas[0]}
            onSubmit={handleSubmit}
            components={{}}
            effects={($, ctx) => {
              $('onFormMount').subscribe(async () => {
                const addressRes = await getLogisticsSelectListReceiverAddress()
                ctx.setFieldState('deliverAddressId', (state) => {
                  state.props.enum = addressRes.data.map((item) => ({ label: item.fullAddress, value: item.id }))
                })

                if (pageStatus === PageStatus.ADD) {
                  ctx.setFieldValue('hasAimPrice', true)
                  ctx.setFieldValue('isQualificationCheck', true)
                  ctx.setFieldValue('isOnlineEvaluation', true)
                }

                if (pageStatus === PageStatus.EDIT) {
                  ctx.setFieldState('isOnlineEvaluation', (state) => (state.props['x-component-props'].disabled = true))
                  ctx.setFieldState(
                    '*(memberName, inviteTenderInStatus, inviteTenderOutStatus, createTime)',
                    (state) => (state.visible = true),
                  )
                }

                $('onFieldValueChange', 'inviteTenderType').subscribe((state) => {
                  if (state.value === PUBLIC_BID) {
                    if (pageStatus === PageStatus.EDIT && !publicFlag.current) {
                      publicRef.current.setVisible(false)
                      publicFlag.current = true
                    } else {
                      publicRef.current.setVisible(true)
                    }
                  } else if (state.value === SYSTEM_BID) {
                    // @todo 需调用后台接口获取匹配的会员数据
                    // addSchemaAction.setFieldState('memberList', state => {
                    //   state.props.visible = false
                    // })
                  } else if (state.value === INVITE_BID) {
                  }
                })

                $('onFieldValueChange', 'isQualificationCheck').subscribe((state) => {
                  if (!state.value) {
                    ctx.setFieldValue('preCheckStartTime', null)
                    ctx.setFieldValue('preCheckEndTime', null)
                  }
                })
              })

              // 监听附件列表字段变动 处理编辑情况下的id问题
              useAttachmentChangeForEdit(ctx)

              useAsyncSelect('templateId', fetchTemplateSelectOptions)
            }}
            expressionScope={{
              materialAddButton,
              materialColumns,
              materialComponents,
              inviteAddButton,
              memberColumn: inviteMemberColumns,
              help,
              beforeUpload,
            }}
          />
        </Card>

        {/* 关联投标商品 */}
        <RelevanceGoodDrawer
          title={intl.formatMessage({ id: 'detail.purchase.modalTitle27' })}
          currentRef={goodRef}
          schemaAction={drawerSchemaAction}
          pageAction={addSchemaAction}
          dataIdList={dataIdList}
        />

        {/* 公开方式招标 触发弹窗 */}
        {shopInfo.length ? (
          <PublicBidModal
            inviteTenderShopList={initFormValue?.inviteTenderShopList}
            shopInfo={shopInfo}
            currentRef={publicRef}
            pageAction={addSchemaAction}
          />
        ) : null}

        {/* 选择会员 */}
        <MemberModal currentRef={memberRef} schemaAction={addSchemaAction} />
      </ReadyAddBidDetailContext.Provider>
    </PageHeaderWrapper>
  )
}

AddNewBid.defaultProps = {}

export default AddNewBid
