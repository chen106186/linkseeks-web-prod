/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useRef, useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Button, Col, message, Row, Select, Upload } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { increaseSchema } from './schema'
import { useEditHideField, useMaterialTableChangeForAmount } from './effects'
import { procurementProcessField, procurementRenderField, procurmentRenderInit } from './constant'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '../../common'
import { useMaterialTable } from './model/useMaterialTable'
import MaterialModalTable from './components/materialModalTable'
import DepartmentModalTable from './components/departmentModalTable'
// import MemberModalTable from './components/memberModalTable'
import RequisitionerTable from './components/requisitionerTable'
import styled from 'styled-components'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  getPurchaseRequisitionDeliveryMethodItems,
  getPurchaseRequisitionDetail,
  postPurchaseRequisitionCreate,
  postPurchaseRequisitionUpdate,
} from '@apps/apis'
import { getProductSelectGetWarehouse } from '@apps/apis'
import { UPLOAD_TYPE } from '@/constants'
import styles from './index.less'
import { authService } from '@apps/services'
import { AuthButton } from '@apps/components'
import RadioNode from './components/RadioNode'
import NewMemberModalTable from './components/newMemberModalTable'
import RelationSaleOrderEdit from '../components/relationSaleOrderEdit'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
const addSchemaAction = createFormActions()
const { Option } = Select
const RowStyle = styled((props) => (
  <Row style={{ marginTop: 12, justifyContent: 'flex-end' }} justify="end" {...props}>
    {props.children}
  </Row>
))`
  .ant-col {
    text-align: center;
  }
  .ant-col div {
    margin-bottom: 12px;
  }
`

// 总计金额联动框
export const MoneyTotalBox = registerVirtualBox('moneyTotalBox', () => {
  const intl = useIntl()
  const { form } = useFormSpy({ selector: [['onFieldValueChange', 'products']], reducer: (v) => v })
  const data = form.getFieldValue('products')
  const sum = data
    ? data.reduce((prev, next) => (prev * 1000 + (next.price || 0) * (next.quantity || 0) * 1000) / 1000, 0)
    : 0
  const total = data ? data.reduce((prev, next) => (prev * 1000 + (next.quantity || 0) * 1000) / 1000, 0) : 0

  return (
    <RowStyle>
      <Col span={2}>
        <div>
          {intl.formatMessage({
            id: 'purchaseRequisition.shuliangheji',
            defaultMessage: '数量合计',
          })}
        </div>
        <div>{total.toFixed(2)}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseRequisition.jinezongji', defaultMessage: '金额总计' })}</div>
        <div>{`${translate('web.common.currencySymbol')}${sum.toFixed(2)}`}</div>
      </Col>
    </RowStyle>
  )
})

/** 采购请购单 新增 */
const IncreaseRequisition: React.FC<{}> = () => {
  const departmentRef = useRef<any>({}) // 选部门
  const memberRef = useRef<any>({})
  const RequisRef = useRef<any>({}) // 请购人
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  const { id } = usePageStatus()
  const [initFormValue, setInitFormValue] = useState<any>({})
  const { formContext } = useFormDetail()
  const rowvendorMemberInfoRef = useRef<any>({})
  const deliveryTypeListRef = useRef<any>({})
  const enclosureRef = useRef<any>({})
  const attachmentsRef = useRef<any>({})
  const [unsaved, setUnsaved] = useState(false)
  const [relationSaleOrderEditVisible, setRelationSaleOrderEditVisible] = useState<boolean>(false)
  const [relationSaleOrderEditRecord, setRelationSaleOrderEditRecord] = useState<any>()
  const [warehouseOptions, setWarehouseOptions] = useState<any>([])

  const intl = useIntl()
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const { state } = useLocation()
  const _state: any = state

  const handleRelationSaleOrderEdit = (record) => {
    setRelationSaleOrderEditRecord(record)
    setRelationSaleOrderEditVisible(true)
  }

  const handleRelationSaleOrderEditConfirm = (rows: any) => {
    const _list = addSchemaAction.getFieldValue('products')
    const _index = _list.findIndex((item) => item.id === relationSaleOrderEditRecord.id)
    _list[_index].orderProductIds = rows
    addSchemaAction.setFieldValue('products', _list)
  }

  // 请购单物料
  const {
    materialAddButton,
    materialRef,
    materialColumns,
    materialComponents,
    materialChildren,
    handleSave,
    ...surplusProps
  } = useMaterialTable(addSchemaAction, handleRelationSaleOrderEdit)

  useEffect(() => {
    if (_state?.rows) {
      addSchemaAction.setFieldValue('products', _state?.rows)
      _state?.rows.map((item) => {
        return handleSave(item)
      })
    }
    if (id) {
      setFormLoading(true)
      getPurchaseRequisitionDetail({ id }).then((res: any) => {
        const { data } = res
        const _orderProductRequests = procurementRenderField(data)
        addSchemaAction.setFieldState('deliveryAddressId', (__state) => {
          __state.props.isDefaultAddress = false
          // __state.visible = data.deliveryAddress ? false : true

          // state.visible = data.deliveryMethod == 1 && data.deliveryType != 1 ? true : false;
        })
        addSchemaAction.setFieldState('deliveryAddress', (__state) => {
          // __state.visible = data.deliveryAddress ? true : false
          // state.visible = data.deliveryMethod != 1 || data.deliveryType == 1 ? true : false;
        })
        if (data.deliveryMethod === 1) {
          deliveryTypeListRef.current.deliveryTypeList = deliveryTypeListRef.current.deliveryTypeList.map((item) => {
            return {
              ...item,
              disabled: (item.disabled = item.deliveryTypeName == '直送客户' ? false : true),
            }
          })

          console.log(deliveryTypeListRef.current.deliveryTypeList)
        }
        if (data.deliveryMethod == 2) {
          deliveryTypeListRef.current.deliveryTypeList = deliveryTypeListRef.current.deliveryTypeList.map((item) => {
            return {
              ...item,
              disabled: (item.disabled = item.deliveryTypeName == '直送客户' ? true : false),
            }
          })
        }

        addSchemaAction.setFieldState('deliveryType', (__state) => {
          __state.visible = true
          __state.props.deliveryType = data.deliveryMethod
          __state.props['x-component-props'].list = deliveryTypeListRef.current.deliveryTypeList
        })
        // setdeliveryType(data.deliveryType)
        rowvendorMemberInfoRef.current = {
          memberId: data.vendorMemberId,
          roleId: data.vendorRoleId,
        }
        const arr = []
        data.product.products.map((item: any) => {
          handleSave(item)
          arr.push({ label: item.name, value: item.id })
        })
        enclosureRef.current.list = [...arr]
        attachmentsRef.current.attachments = data.attachments
        setInitFormValue(() => procurmentRenderInit(data))
        setTimeout(() => {
          addSchemaAction.setFieldValue('products', _orderProductRequests)
          addSchemaAction.setFieldValue('attachments', data.attachments)
          addSchemaAction.setFieldValue('deliveryAddressId', data.receiverAddressResponse)
          addSchemaAction.setFieldValue('deliveryType', data.deliveryType)
          addSchemaAction.setFieldValue('deliveryAddress', data.deliveryAddress)
        }, 500)
        setFormLoading(false)
        setUnsaved(false)
      })
    } else {
      const userInfo: any = authService.getAuth()
      addSchemaAction.setFieldValue('requisitioner', userInfo.userName)
      addSchemaAction.setFieldValue('requisitionerId', userInfo.userId)
      if (userInfo.orgId && userInfo.orgName) {
        addSchemaAction.setFieldValue('vendorMemberName', userInfo.orgName || '')
        addSchemaAction.setFieldValue('deliveryType', userInfo.orgId || '')
      }
    }
  }, [])

  const setLik = (row) => {
    rowvendorMemberInfoRef.current = row
  }
  // 跳转会员信息
  const Jump = () => {
    if (Object.keys(rowvendorMemberInfoRef.current).length) {
      history.push(
        `/supplierAbility/manage/memberMaintain/detail?id=${rowvendorMemberInfoRef.current.memberId}&validateId=${rowvendorMemberInfoRef.current.id}`,
      )
    }
  }
  // 供应会员
  const vendorMemberNameNode = (
    <div className="connectBtn" onClick={Jump} style={{ cursor: 'pointer', color: '#00A98F' }}>
      {intl.formatMessage({
        id: 'purchaseRequisition.gongyinghuiyuan',
        defaultMessage: '供应会员',
      })}
    </div>
  )

  const handleSubmit = async (value) => {
    try {
      let fnResult = null
      // 新增订单/编辑订单
      const params = {
        ...value,
        warehouseName: warehouseOptions?.find((item) => item.id === value.warehouseId)?.name,
      }
      console.log(value)
      if (formContext.innerFormErrors) {
        return message.error(
          intl.formatMessage({
            id: 'purchaseRequisition.qingwanshandingdan',
            defaultMessage: '请完善订单物料数据',
          }),
        )
        // throw new Error(intl.formatMessage({ id: 'purchaseRequisition.qingwanshandingdan', defaultMessage: '请完善订单物料数据' }))
      }
      // 校验采购数量
      const judgementByCount =
        params.products?.length &&
        params.products.map((item) => {
          if (item.quantity) {
            return true
          } else {
            return false
          }
        })
      if (!judgementByCount || judgementByCount.includes(false)) {
        // throw new Error(intl.formatMessage({ id: 'purchaseRequisition.qingtianxieshangpin', defaultMessage: '请填写商品采购数量' }))
        return message.error(
          intl.formatMessage({
            id: 'purchaseRequisition.qingtianxieshangpin',
            defaultMessage: '请填写商品采购数量',
          }),
        )
      }
      setBtnLoading(true)

      const _params = procurementProcessField(params)
      console.log(_params)
      if (_params.deliveryAddressId) {
        _params.deliveryAddressId = _params.deliveryAddressId.id
      }
      if (id) {
        fnResult = await postPurchaseRequisitionUpdate({ ..._params, id })
      } else {
        fnResult = await postPurchaseRequisitionCreate(_params)
      }
      if (fnResult.code === 1000) {
        setUnsaved(false)
        setTimeout(() => {
          history.push('/procurementAbility/purchaseRequisition/readyAddBill')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      console.log(error)
    }
  }

  // 选中请购人
  const handleOrder = () => {
    RequisRef.current.setVisible(true)
  }
  const RequisitionerBtn = (
    <div className="connectBtn" onClick={handleOrder}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseRequisition.xuanze', defaultMessage: '选择' })}
    </div>
  )

  // 选择会员弹窗
  const handleOrderMember = () => {
    memberRef.current.setVisible(true)
  }

  const memberBtn = (
    <div className="connectBtn" onClick={handleOrderMember}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseRequisition.xuanze', defaultMessage: '选择' })}
    </div>
  )

  // 选择合同
  const handleDepartment = () => {
    departmentRef.current.setVisible(true)
  }

  const departmentBtn = (
    <div className="connectBtn" onClick={handleDepartment}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseRequisition.xuanze', defaultMessage: '选择' })}
    </div>
  )

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }

  // 上传附件表格
  const [enclosureColumns, setenclosureColumns] = useState<any>([])
  // 删除关联物流
  const del = (record) => {
    const newData = [...addSchemaAction.getFieldValue('attachments')]
    // 删除formvalue
    const colIndex = newData.findIndex((v) => v.id === record.id)
    newData.splice(colIndex, 1)
    addSchemaAction.setFieldValue('attachments', newData)
  }

  const handleFirstChange = (value: string, index: number) => {
    const val = value.split('_+_')
    const newData = [...addSchemaAction.getFieldValue('attachments')]
    newData[index].goodsName = val[0]
    newData[index].goodsId = val[1]
    addSchemaAction.setFieldValue('attachments', newData)
    attachmentsRef.current.attachments = newData
  }
  // 上传
  const handleFrontUrl = async ({ fileList }) => {
    if (fileList[0].response) {
      if (fileList[0].response.code === 1000) {
        const newData = [...addSchemaAction.getFieldValue('attachments')]
        newData.push({
          name: fileList[0].name,
          url: fileList[0].response.data,
          index: newData.length + 1,
        })
        addSchemaAction.setFieldValue('attachments', newData)
        attachmentsRef.current.attachments = newData
      }
    }
  }

  const fetchOptions = (service) => {
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        const deliveryTypeList = res.data.deliveryTypes.map((item) => {
          return { ...item, disabled: true }
        })
        deliveryTypeListRef.current.deliveryTypeList = deliveryTypeList
        return res.data.deliveryMethods.map((item) => {
          return { label: item.deliveryMethodName, value: item.deliveryMethod }
        })
      }
      return []
    }
  }

  const fetchWarehouseOptions = (service) => {
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        setWarehouseOptions(res.data)
        return res.data.map((item) => {
          return { label: item.name, value: item.id }
        })
      }
      return []
    }
  }
  /**
   * 上传大小限制
   * */
  const beforeDocUpload = (file: any) => {
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      message.error(intl.formatMessage({ id: 'contract.shangchuanwenjiandaxiaobuchao' }))
    }
    return isLt50M
  }
  // 添加附件
  const enclosureColumnsButton = (
    <Upload
      action="/api/support/file/upload"
      data={{ fileType: UPLOAD_TYPE }}
      showUploadList={false}
      beforeUpload={beforeDocUpload}
      onChange={handleFrontUrl}
      // accept='.doc,.docx,.pdf'
      style={{ width: '100%' }}
      maxCount={1}
    >
      <Button style={{ width: '100%' }}>
        <UploadOutlined /> {intl.formatMessage({ id: 'components.shangchuanwenjian' })}
      </Button>
    </Upload>
  )

  // 选择物料
  const confirmModal = async () => {
    const list = addSchemaAction.getFieldValue('products')
    const arr = []
    list.map((item: any) => {
      arr.push({ label: item.name, value: item.id })
    })
    enclosureRef.current.list = [...arr]
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    constructedCallback()
  }

  useEffect(() => {
    console.log(enclosureRef.current)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    constructedCallback()
  }, [enclosureRef.current])

  const constructedCallback = () => {
    const _col = []
    const name = {
      title: translate('web.common.wenjian'),
      key: 'name',
      dataIndex: 'name',
    }
    _col.push(name)
    const goodsName = {
      title: translate('web.resource.order.guanlianwuliao'),
      key: 'goodsName',
      dataIndex: 'goodsName',
      render: (text, record, index) => {
        const goodsInfo = id && text ? enclosureRef.current.list.find((item) => item.label === text) : ''
        return (
          <Select
            style={{ width: 230 }}
            defaultValue={goodsInfo ? `${goodsInfo?.label}_+_${goodsInfo?.value}` : ''}
            onChange={(value) => handleFirstChange(value, index)}
          >
            {Object.keys(enclosureRef.current).length &&
              enclosureRef.current.list.map((item: any) => {
                return (
                  <Option value={`${item.label}_+_${item.value}`} key={item.value}>
                    {item.label}
                  </Option>
                )
              })}
          </Select>
        )
      },
    }
    _col.push(goodsName)
    const btn = {
      title: translate('web.common.control'),
      render: (text, record) => {
        return (
          <Button type="link" onClick={() => del(record)}>
            {intl.formatMessage({ id: 'purchaseRequisition.shanchu', defaultMessage: '删除' })}
          </Button>
        )
      },
    }
    _col.push(btn)
    setenclosureColumns(_col)
    addSchemaAction.setFieldValue('attachments', [])
    setTimeout(() => {
      addSchemaAction.setFieldValue('attachments', attachmentsRef.current.attachments)
    }, 500)
  }

  const hideAddress = () => {
    addSchemaAction.setFieldState('deliveryAddress', (__state) => {
      __state.visible = false
    })
    addSchemaAction.setFieldState('deliveryAddressId', (__state) => {
      __state.visible = false
    })
  }

  const onChangeAddress = (res) => {
    console.log(res, 'res')
    if (res.values[1]?.value === 1) {
      const list = deliveryTypeListRef.current.deliveryTypeList.map((item) => {
        return {
          ...item,
          disabled: (item.disabled = item.deliveryTypeName == '客户自提' ? true : false),
        }
      })
      addSchemaAction.setFieldState('deliveryAddress', (__state) => {
        __state.visible = false
      })
      addSchemaAction.setFieldState('deliveryType', (__state) => {
        __state.props['x-component-props'].list = list
        __state.props.deliveryType = ''
      })
      addSchemaAction.setFieldState('deliveryAddressId', (__state) => {
        __state.visible = true
      })
      addSchemaAction.setFieldState('deliveryType', (__state) => {
        __state.visible = true
      })
      return
    } else {
      hideAddress()
    }
    if (res.values[1]?.value === 2) {
      const list = deliveryTypeListRef.current.deliveryTypeList.map((item) => {
        return {
          ...item,
          disabled: (item.disabled = item.deliveryTypeName == '直送客户' ? true : false),
        }
      })
      addSchemaAction.setFieldState('deliveryType', (__state) => {
        __state.visible = true
        __state.props['x-component-props'].list = list
        __state.props.deliveryType = ''
      })
      addSchemaAction.setFieldValue('deliveryAddressId', '')
      addSchemaAction.setFieldState('deliveryAddressId', (__state) => {
        __state.visible = false
      })
      return
    } else {
      hideAddress()
    }
    if (res.values[1]?.value === 3) {
      const list =
        deliveryTypeListRef.current.deliveryTypeList &&
        deliveryTypeListRef.current?.deliveryTypeList.map((item) => {
          return { ...item, disabled: true }
        })
      addSchemaAction.setFieldState('deliveryType', (__state) => {
        __state.props['x-component-props'].list = list
        __state.props.deliveryType = ''
      })
      addSchemaAction.setFieldState('deliveryAddress', (__state) => {
        __state.visible = false
      })
      addSchemaAction.setFieldState('deliveryAddressId', (__state) => {
        __state.visible = false
      })
      return
    } else {
      hideAddress()
    }
  }
  return (
    <div className={styles.mian}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={
            id
              ? intl.formatMessage({
                  id: 'purchaseRequisition.bianjiqinggoudan',
                  defaultMessage: '编辑请购单',
                })
              : intl.formatMessage({
                  id: 'purchaseRequisition.xinzengqinggoudan',
                  defaultMessage: '新增请购单',
                })
          }
          schema={increaseSchema}
          extraRight={[
            <Button
              key="1"
              onClick={() => addSchemaAction.submit()}
              loading={btnLoading}
              type="primary"
              icon={<SaveOutlined />}
            >
              {intl.formatMessage({ id: 'purchaseRequisition.baocun', defaultMessage: '保存' })}
            </Button>,
          ]}
        />
        <FormDetailWrapper>
          {/* <Card className={styles.restContainer}> */}
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={increaseSchema}
            onSubmit={handleSubmit}
            components={{
              RadioNode,
            }}
            effects={($, ctx) => {
              $('onFormMount').subscribe(() => {})
              useEditHideField()
              useAsyncSelect('deliveryMethod', fetchOptions(getPurchaseRequisitionDeliveryMethodItems))
              useAsyncSelect('warehouseId', fetchWarehouseOptions(getProductSelectGetWarehouse))

              // 物料信息的改动 渲染总额
              useMaterialTableChangeForAmount(ctx, update)

              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)

              $('onFieldChange', 'deliveryMethod').subscribe((res) => {
                onChangeAddress(res)
                // 配送方式切换 清空 客户配送方式和送货地址
                ctx.setFieldValue('deliveryType', null)
              })
              $('onFormInputChange').subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })

              // 客户方式变动 999为不选择 清空送货地址
              $('onFieldValueChange', 'deliveryType').subscribe((res) => {
                if (res.value === 999) {
                  ctx.setFieldValue('deliveryAddressId', null)
                  ctx.setFieldValue('deliveryAddress', null)
                  hideAddress()
                } else if (res.value === 1) {
                  addSchemaAction.setFieldState('deliveryAddressId', (__state) => {
                    __state.visible = true
                  })
                } else {
                  // addSchemaAction.setFieldState('deliveryAddress', (__state) => {
                  //   __state.visible = true
                  // })
                }
              })
            }}
            expressionScope={{
              memberBtn,
              departmentBtn,
              materialColumns,
              materialAddButton,
              RequisitionerBtn,
              materialComponents,
              materialChildren,
              help,
              enclosureColumns,
              enclosureColumnsButton,
              vendorMemberNameNode,
              scroll: { x: '100%' },
            }}
          />
          {/* </Card> */}
        </FormDetailWrapper>
      </FormDetailContext.Provider>

      {/* 选择部门 */}
      <DepartmentModalTable currentRef={departmentRef} schemaAction={addSchemaAction} />
      {/* 选择采购物料 */}
      <MaterialModalTable
        confirmModal={confirmModal}
        row={rowvendorMemberInfoRef.current}
        currentRef={materialRef}
        schemaAction={addSchemaAction}
        sectionProps={surplusProps}
      />
      {/* 选择供应会员 */}
      <NewMemberModalTable currentRef={memberRef} schemaAction={addSchemaAction} setLik={setLik} />
      {/* 请购人选择会员 */}
      <RequisitionerTable currentRef={RequisRef} schemaAction={addSchemaAction} />
      {/*  */}
      <RelationSaleOrderEdit
        visible={relationSaleOrderEditVisible}
        recordData={relationSaleOrderEditRecord}
        onClose={() => {
          setRelationSaleOrderEditVisible(false)
        }}
        onConfirm={handleRelationSaleOrderEditConfirm}
      />
      {/* </PageHeaderWrapper> */}
    </div>
  )
}

IncreaseRequisition.defaultProps = {}

export default IncreaseRequisition
