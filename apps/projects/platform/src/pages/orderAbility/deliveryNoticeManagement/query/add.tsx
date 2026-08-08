import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { Button, Form, Input, message, Radio, Table } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { DeliveryNoticeOrderAddService } from '../../assets/handles/HandleFormSubmit'
import {
  BillsInfo,
  BuyerLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryAbstractNoLabel,
  DeliveryDate,
  DeliveryDateLabel,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryNoLabel,
  DeliveryPanleNoLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTimeLabel,
  DeliveryTypeLabel,
  Distribution,
  LogisticsCarNoLabel,
  LogisticsCompanyLabel,
  LogisticsInfo,
  LogisticsNoLabel,
  Material,
  NoteLabel,
  ReceivingAddress,
  ReceivingTime,
} from '../../constants'
import { BaseInfo } from '@/components/BaseInfo'
import { required, FormItem } from '@/components/FormItem'
import { RoleSelect } from '@/components/RoleSelect'
import { ReceiverAddress, ShipperAddress } from '@/components/AddressDrawer'
import LogisticsCompanyMerchantsSelect from '@/components/LogisticsCompanySelect/LogisticsCompanyMerchantsSelect'
import { HarvestMaterialContextProvider, HarvestMaterialInput } from '../../assets/context'
import { DeliveryNoticeTableColumn, DeliveryNoticeTableColumnSRM } from '../../constants/page-table-column'
import { DeliveryNumColumn, OrderNumColumn } from '../../constants/table-column'
import { DatePickerSelect } from '@/components/DatePickerSelect'
import { SourceTypeEnum } from '../../constants/SourceTypeEnum'
import { useQuery } from '@linkseeks/router-core'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { RoleTypeEnum } from '../../constants/RoleTypeEnum'
import usePrompt from '@/hooks/usePrompt'
import { useAnchor } from '@/utils/hooks'
import useLogistics from '../../assets/hooks/useLogistics'
import { validatorByteObject } from '@/utils/regExp'

const ContentBox = BaseInfo
const service = new DeliveryNoticeOrderAddService()

function DeliveryNoticeFromCreate() {
  const [tableDataSource, setTableDataSource] = useState<any[]>()
  const [type, setType] = useState(0)
  const { handleLeave } = usePrompt()

  const { handleLogisticsShow, isSince } = useLogistics()

  const [form] = Form.useForm()
  service.setForm(form)

  const { id } = useQuery()

  const [loading, setLoading] = useState(false)

  const { anchors, update, delUpdate } = useAnchor([BillsInfo, Distribution, DeliveryInfo, LogisticsInfo])

  useEffect(() => {
    // 设置类型
    form.setFieldsValue({ sourceType: SourceTypeEnum.NoticeAdd })

    service.getDetailById(id).then((res) => {
      if (!res) {
        history.back()
        return
      }

      const type = res.orderType

      service.setFormService(type)
      setType(type)

      form.setFieldsValue(res)

      handleAnchor(type, res.products.length)

      setTableDataSource(res.products)
    })
  }, [])

  const handleAnchor = (type, len) => {
    update([
      type === RoleTypeEnum.B2B
        ? {
            ...DeliveryGood,
            name: `${DeliveryGood.name}(${len})`,
          }
        : {
            ...Material,
            name: `${Material.name}(${len})`,
          },
    ])
  }

  const handleDelAnchor = (len) => {
    delUpdate([
      type === RoleTypeEnum.B2B
        ? {
            ...DeliveryGood,
            name: `${DeliveryGood.name}(${len})`,
          }
        : {
            ...Material,
            name: `${Material.name}(${len})`,
          },
    ])
  }

  const handleSubmit = useCallback(() => {
    setLoading(true)
    service.getForomService().setTableData(tableDataSource)
    service
      .getForomService()
      .submit()
      .then((res) => {
        if (res.code === 1000) {
          handleLeave(false)
          setTimeout(() => {
            history.go(-1)
          }, 1000)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [form, tableDataSource])

  const handleRemoveMaterialTableRow = (i: number) => {
    const source: any[] = tableDataSource
    const newSource = source.splice(i, 0)
    handleDelAnchor(newSource.length)
    setTableDataSource(newSource)
  }

  return (
    <AnchorPage
      title="新增送货单"
      anchors={anchors}
      extra={
        <Button loading={loading} onClick={handleSubmit} type="primary">
          提交
        </Button>
      }
    >
      <Form form={form} onValuesChange={() => handleLeave()}>
        <FormItem hidden name="sourceType">
          <Input type="hidden" />
        </FormItem>

        <ContentBox title={BillsInfo.name} id={BillsInfo.key}>
          <FormItem rules={[required()]} label={DeliveryNoLabel} name="sourceNo">
            <Input />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryAbstractLabel} name="digest">
            <Input />
          </FormItem>

          <FormItem label={NoteLabel} name="remark">
            <Input placeholder="最长100字符，50个汉字" />
          </FormItem>

          <FormItem rules={[required()]} label={BuyerLabel} name="member">
            <RoleSelect
              formProp={form}
              disabled={true}
              formatFeils={(e) => {
                return {
                  buyerMemberId: e.memberId,
                  buyerRoleId: e.roleId,
                  roleType: 2,
                  name: e.name,
                }
              }}
            />
          </FormItem>
        </ContentBox>

        <ContentBox title={Distribution.name} id={Distribution.key}>
          <FormItem rules={[required()]} label={DeliveryDate} name="deliveryTime">
            <DatePickerSelect disabled={true} className="w-full" />
          </FormItem>

          <FormItem label={DeliveryNameLabel} name="executorVO.consignee">
            <Input placeholder={`请输入${DeliveryNameLabel}`} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliveryTimeLabel} name="deliveryRangeTime">
            <DatePickerSelect.RangePicker disabled={true} className="w-full" picker="time" />
          </FormItem>

          <FormItem label={DeliveryPhoneLabel} name="executorVO.phone">
            <Input placeholder={`请输入${DeliveryPhoneLabel}`} />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <FormItem rules={[required()]} label={ConsigneeTimeLabel} name="sendTime">
            <DatePickerSelect className="w-full" />
          </FormItem>

          <FormItem label={ReceivingAddress} name="receiveVO">
            <ReceiverAddress hiddenBtn={true} disabled={true} />
          </FormItem>

          <FormItem rules={[required()]} label={DeliverySlefAddrLabel} name="deliveryVO">
            <ShipperAddress
              onChange={(v) => {
                form.setFieldsValue({
                  'executorVO.phone': v.phone,
                })
              }}
            />
          </FormItem>
        </ContentBox>

        <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <FormItem rules={[required(`请选择${DeliveryTypeLabel}`)]} label={DeliveryTypeLabel} name="deliveryType">
            <Radio.Group
              onChange={(e) => {
                form.setFieldsValue({ deliveryType: e.target?.value })
                handleLogisticsShow(e.target.value)
              }}
            >
              <Radio.Button value={1}>物流</Radio.Button>
              <Radio.Button value={2}>自提</Radio.Button>
              {/* <Radio.Button value={3}>无效配送</Radio.Button> */}
            </Radio.Group>
          </FormItem>

          <FormItem hidden={isSince} label={LogisticsCarNoLabel} name="executorVO.carNumbers">
            <Input />
          </FormItem>
          <FormItem hidden={isSince} label={LogisticsCompanyLabel} name="logisticsCompanyInt">
            <LogisticsCompanyMerchantsSelect formProp={form} />
          </FormItem>
          <FormItem
            rules={
              isSince ? [validatorByteObject(20)] : [validatorByteObject(20), required(`请输入${LogisticsNoLabel}`)]
            }
            hidden={isSince}
            label={LogisticsNoLabel}
            name="logisticsNo"
          >
            <Input />
          </FormItem>
        </ContentBox>

        <ContentBox title={DeliveryGood.name} id={DeliveryGood.key} cols={1}>
          <HarvestMaterialContextProvider
            value={{
              dataSource: tableDataSource,
            }}
          >
            <Table
              rowKey={(row) => row.orderNo}
              columns={[
                ...(type === RoleTypeEnum.B2B ? DeliveryNoticeTableColumn : DeliveryNoticeTableColumnSRM),
                {
                  ...DeliveryNumColumn,
                  render: (t, rcode, index) => {
                    return (
                      <HarvestMaterialInput
                        value={rcode?.deliveryCount}
                        index={index}
                        keyup="deliveryCount"
                        disabled={true}
                      />
                    )
                  },
                },
                // , {
                //   title: "操作",
                //   render: (t, r, i) => {
                //     return (
                //       <Button type='link' onClick={() => handleRemoveMaterialTableRow(i)}>删除</Button>
                //     )
                //   }
                // }
              ]}
              dataSource={tableDataSource}
            />
          </HarvestMaterialContextProvider>
        </ContentBox>
      </Form>
    </AnchorPage>
  )
}

export default DeliveryNoticeFromCreate
