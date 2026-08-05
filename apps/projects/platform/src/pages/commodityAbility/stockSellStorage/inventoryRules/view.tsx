import React, { useState, useEffect } from 'react'
import { Button, Form, Card, Select, Checkbox, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { authService } from '@apps/services'
import { PageHeaderWrapper } from '@apps/components'
import {
  getProductSelectGetInvoicesPlus,
  getProductWarehouseRuleConfigGetWarehouseAutoEnter,
  postProductWarehouseRuleConfigSaveOrUpdateWarehouseAutoEnter,
  getProductWarehouseRuleConfigGetWarehouseSync,
  postProductWarehouseRuleConfigSaveOrUpdateWarehouseSync,
} from '@apps/apis'
import { getMemberRoleOtherRoleList } from '@apps/apis'

const { Option } = Select

const InventoryRules: React.FC = () => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const [invoicesPlusOptions, setInvoicesPlusOptions] = useState<any>([])
  const [otherRoleList, setOtherRoleList] = useState<any>([])
  const [isCreate, setIsCreate] = useState<boolean>(true)
  const [isInventory, setIsInventory] = useState<boolean>(false)
  const [isMaterial, setIsMaterial] = useState<boolean>(false)
  const [isWarehouse, setIsWarehouse] = useState<boolean>(false)
  const [invoicesTypeId, setInvoicesTypeId] = useState<any>()
  const intl = useIntl()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const [rulesForm] = Form.useForm()

  const auth = authService.getAuth()

  useEffect(() => {
    getProductSelectGetInvoicesPlus().then((res) => {
      if (res.code === 1000) {
        setInvoicesPlusOptions(res.data)
      }
    })
    getMemberRoleOtherRoleList().then((res) => {
      message.destroy()
      if (res.code === 1000) {
        setOtherRoleList(res.data)
      }
    })
    const func = async () => {
      try {
        const { data: autoData } = await getProductWarehouseRuleConfigGetWarehouseAutoEnter()
        // const { data: sncData } = await getProductWarehouseRuleConfigGetWarehouseSync();
        setIsCreate(autoData?.isCreate)
        setInvoicesTypeId(autoData?.invoicesTypeId)
        // setIsInventory(sncData?.isInventory);
        // setIsMaterial(sncData?.isMaterial);
        // setIsWarehouse(sncData?.isWarehouse);
        rulesForm.setFieldsValue({ ...autoData })
      } catch (error) {}
    }
    func()
    setUnsaved(true)
  }, [])

  useEffect(() => {
    if (!isInventory) {
      setIsMaterial(false)
      setIsWarehouse(false)
      rulesForm.setFieldsValue({
        isMaterial: false,
        materialMemberRoleId: undefined,
        isWarehouse: false,
        warehouseMemberRoleId: undefined,
      })
    } else {
      rulesForm.setFieldsValue({ inventoryMemberRoleId: undefined })
    }
  }, [isInventory])

  useEffect(() => {
    if (!isMaterial) {
      rulesForm.setFieldsValue({ materialMemberRoleId: undefined })
    }
  }, [isMaterial])

  useEffect(() => {
    if (!isWarehouse) {
      rulesForm.setFieldsValue({ warehouseMemberRoleId: undefined })
    }
  }, [isWarehouse])

  const formSubmit = () => {
    rulesForm.validateFields().then((values) => {
      const _autoParams = {
        isCreate: values.isCreate,
        invoicesTypeId: values.invoicesTypeId,
      }
      const _syncParams = { ...values, isInventory }
      delete _syncParams.isCreate
      delete _syncParams.invoicesTypeId
      setSubmitLoading(true)
      //postProductWarehouseRuleConfigSaveOrUpdateWarehouseSync(_syncParams)

      Promise.all([postProductWarehouseRuleConfigSaveOrUpdateWarehouseAutoEnter(_autoParams)])
        .then((resValues) => {
          // setUnsaved(false);
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    })
  }

  return (
    <div>
      <PageHeaderWrapper
        title={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.title' })}
        extra={
          <Button key="1" type="primary" icon={<SaveOutlined />} loading={submitLoading} onClick={formSubmit}>
            {intl.formatMessage({ id: 'common.button.save', defaultMessage: '保存' })}
          </Button>
        }
        backDom={false}
      >
        <Form
          form={rulesForm}
          colon={false}
          name="basic"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          autoComplete="off"
        >
          {auth?.memberRoleType === 2 && (
            <Card
              title={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.1' })}
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.1.isCreate' })}
                name="isCreate"
              >
                <>
                  <Checkbox
                    checked={isCreate}
                    onChange={(e) => {
                      setIsCreate(e.target.checked)
                      rulesForm.setFieldsValue({ isCreate: e.target.checked })
                    }}
                  >
                    {intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.1.isCreate.text' })}
                  </Checkbox>
                  <div style={{ fontSize: 12, color: '#91959B', marginTop: 8 }}>
                    {intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.1.isCreate.tips' })}
                  </div>
                </>
              </Form.Item>
              {isCreate && (
                <Form.Item
                  label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.1.invoicesTypeId' })}
                  name="invoicesTypeId"
                  required={isCreate}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'stockSellStorage.inventoryRules.card.1.invoicesTypeId.message',
                      }),
                    },
                  ]}
                >
                  <>
                    <Select
                      value={invoicesTypeId}
                      onChange={(value) => {
                        setInvoicesTypeId(value)
                        rulesForm.setFieldsValue({ invoicesTypeId: value })
                      }}
                    >
                      {invoicesPlusOptions?.map((_item) => (
                        <Option key={`invoicesTypeId_${_item.id}`} value={_item.id}>
                          {_item.name}
                        </Option>
                      ))}
                    </Select>
                    <div style={{ fontSize: 12, color: '#91959B', marginTop: 8 }}>
                      {intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.1.invoicesTypeId.tips' })}
                    </div>
                  </>
                </Form.Item>
              )}
            </Card>
          )}
          {/* <Card
            title={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.2' })}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.2.isInventory' })}
              name="isInventory"
            >
              <Checkbox checked={isInventory} onChange={(e) => { setIsInventory(e.target.checked); rulesForm.setFieldsValue({ isInventory: e.target.checked }) }}>{intl.formatMessage({ id: 'stockSellStorage.synchronization' })}</Checkbox>
            </Form.Item>
            {isInventory && <Form.Item
              label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.2.inventoryMemberRoleId' })}
              name="inventoryMemberRoleId"
            >
              <Select>
                {otherRoleList?.map((_item) => <Option key={`inventoryMemberRoleId${_item.id}`} value={_item.id}>{_item.roleName}</Option>)}
              </Select>
            </Form.Item>}
          </Card>
          {!isInventory && <>
            <Card
              title={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.3' })}
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.3.isMaterial' })}
                name="isMaterial"
              >
                <Checkbox checked={isMaterial} onChange={(e) => { setIsMaterial(e.target.checked); rulesForm.setFieldsValue({ isMaterial: e.target.checked }) }}>{intl.formatMessage({ id: 'stockSellStorage.synchronization' })}</Checkbox>
              </Form.Item>
              {isMaterial && <Form.Item
                label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.3.materialMemberRoleId' })}
                name="materialMemberRoleId"
              >
                <Select>
                  {otherRoleList?.map((_item) => <Option key={`materialMemberRoleId${_item.id}`} value={_item.id}>{_item.roleName}</Option>)}
                </Select>
              </Form.Item>}
            </Card>
            <Card
              title={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.4' })}
            >
              <Form.Item
                label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.4.isWarehouse' })}
                name="isWarehouse"
              >
                <Checkbox checked={isWarehouse} onChange={(e) => { setIsWarehouse(e.target.checked); rulesForm.setFieldsValue({ isWarehouse: e.target.checked }) }}>{intl.formatMessage({ id: 'stockSellStorage.synchronization' })}</Checkbox>
              </Form.Item>
              {isWarehouse && <Form.Item
                label={intl.formatMessage({ id: 'stockSellStorage.inventoryRules.card.4.warehouseMemberRoleId' })}
                name="warehouseMemberRoleId"
              >
                <Select>
                  {otherRoleList?.map((_item) => <Option key={`warehouseMemberRoleId${_item.id}`} value={_item.id}>{_item.roleName}</Option>)}
                </Select>
              </Form.Item>}
            </Card>
          </>} */}
        </Form>
      </PageHeaderWrapper>
    </div>
  )
}

export default InventoryRules
