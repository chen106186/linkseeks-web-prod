import { EyeAuthButton } from '@apps/components'
import { Anchor, Button, Card, Form, Radio, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import GoodsTable from './business/Goods'
import PayInfo from './business/PayInfo'
import AutoCancelModel from './components/AutoCancelModel'
import BaseInfo from './components/BaseInfo'
import FlowSwitchSteps from './components/FlowSwitchSteps'
import PageHeader from './components/PageHeader'
const { BaseInfoItem } = BaseInfo
import './detail.global.less'
import { SupplierTableCloums } from './types/table-props'
import { useWebIntl } from '@apps/locales'

function TransferOrderDetail() {
  const intl = useIntl()

  const translate = useWebIntl()
  const [showSubmitModal, setShowSubmitModal] = useState<number>(0)

  return (
    <div>
      <PageHeader
        title="进口头层黄牛荔纹|DPTY12"
        extraRight={
          <Button
            type="primary"
            onClick={() => {
              setShowSubmitModal(showSubmitModal + 2)
            }}
          >
            {translate('web.common.save')}
          </Button>
        }
      >
        <Anchor targetOffset={120} affix={false}>
          <Anchor.Link href="#Transfer" title="流转信息" />
          <Anchor.Link href="#BasicInfo" title="基本信息" />
          <Anchor.Link href="#OrderInfo" title="订单信息" />
          <Anchor.Link href="#PayInfo" title="支付信息" />
          <Anchor.Link href="#Delivery" title="送货信息" />
          <Anchor.Link href="#Contract" title="电子合同" />
          <Anchor.Link href="#Invoice" title="发票信息" />
          <Anchor.Link href="#Other" title="其他信息" />
          <Anchor.Link href="#Adjunct" title="附件" />
        </Anchor>
      </PageHeader>

      <div className="p-10 pt-96 transfer_content">
        <FlowSwitchSteps
          id="Transfer"
          showClockIcon={true}
          btnsName={['内部流转', '内部流转']}
          steps={[
            {
              current: 0,
              list: [
                {
                  title: '提交订单',
                  description: '采购商',
                },
                {
                  title: '提交订单',
                  description: '采购商',
                },
                {
                  title: '提交订单',
                  description: '采购商',
                },
              ],
            },
            {
              current: 3,
              list: [
                {
                  title: '提交订单1',
                  description: '采购商',
                },
                {
                  title: '提交订单2',
                  description: '采购商',
                },
                {
                  title: '提交订单3',
                  description: '采购商',
                },
              ],
            },
          ]}
        />

        <BaseInfo id="BasicInfo" className="mt-10" title="基本信息">
          <BaseInfoItem label="订单号码:">DPTYI2</BaseInfoItem>
          <BaseInfoItem label="供应会员:">
            <Link to={'/'}>广州马皮具交易中心</Link>
          </BaseInfoItem>
        </BaseInfo>

        <GoodsTable />

        <PayInfo />

        <BaseInfo id="Delivery" cols={1} className="mt-10" title="送货信息">
          <BaseInfoItem label="送货日期:">2020-08-25</BaseInfoItem>
          <BaseInfoItem label="送货地址:">
            <div>
              张三 / 185 2929 6758 <br />
              广州马皮具交易中心
            </div>
          </BaseInfoItem>
        </BaseInfo>

        <Card id="Contract" className="mt-10" title="电子合同">
          <EyeAuthButton>广州马皮具交易中心购销合同.pdf</EyeAuthButton>
        </Card>

        <BaseInfo id="Invoice" cols={2} className="mt-10" title="发票信息">
          <BaseInfoItem label="需要发票:">是</BaseInfoItem>
          <BaseInfoItem label="发票抬头:">
            <div>温州市皮革工业有限公司</div>
          </BaseInfoItem>
        </BaseInfo>

        <BaseInfo id="Other" cols={2} className="mt-10" title="其他信息">
          <BaseInfoItem label="保证要求:">纸箱</BaseInfoItem>
          <BaseInfoItem label="备注:">
            <div>要求准时到货</div>
          </BaseInfoItem>
        </BaseInfo>

        <Card id="Adjunct" className="mt-10" title="附件">
          <EyeAuthButton>广州马皮具交易中心购销合同.xls</EyeAuthButton>
        </Card>
      </div>

      <AutoCancelModel
        title="订单转单"
        isShow={showSubmitModal}
        width={1200}
        onOk={async () => {
          return true
        }}
      >
        <div className="finish_sumbit_from">
          <div className="role_type">
            <div className="label text-gray-400">
              转单后的角色会员
              <span className="text-red-600">*</span>
            </div>
            <div className="control mt-4">
              <Radio.Group>
                <Radio.Button value={1}>采购商（默认）</Radio.Button>
                <Radio.Button value={2}>采购商（个人）</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <div className="supplier_table">
            <Table className="mt-4" columns={SupplierTableCloums} />
          </div>
        </div>
      </AutoCancelModel>
    </div>
  )
}

export default TransferOrderDetail
