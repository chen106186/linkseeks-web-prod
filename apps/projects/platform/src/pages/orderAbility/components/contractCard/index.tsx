import React, { useContext, useState } from 'react'
import { Button, Tabs } from 'antd'
import { useWebIntl } from '@apps/locales'
import { OrderDetailContext } from '@/pages/transaction/_public/order/context'
import MellowCard from '@/components/MellowCard'

const ContractCard: React.FC = () => {
  const translate = useWebIntl()
  const { formContext } = useContext(OrderDetailContext)
  console.log(formContext?.data?.contractText, 'contractText')
  return (
    <MellowCard
      id="ContractCardInfo"
      title={translate('web.resource.contract.hetongwenben')}
      fullHeight
      style={{ marginBottom: '16px' }}
    >
      <Tabs>
        {formContext?.data?.contentFiles?.length > 0 ? (
          <Tabs.TabPane tab={translate('web.resource.contract.zhizhihetong')} key="2">
            {formContext?.data?.contentFiles?.length > 0 ? (
              <div>
                {formContext?.data?.contentFiles?.map((item) => {
                  return (
                    <div>
                      <span style={{ marginRight: '12px' }}>{item.fileName}</span>
                      <Button type="link">
                        <a type="link" target="_blank" href={item.url}>
                          {translate('web.common.yulan')}
                        </a>
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>{translate('web.resource.contract.zanwuzhizhihetongxinxi')}</div>
            )}
          </Tabs.TabPane>
        ) : (
          <Tabs.TabPane tab={translate('web.resource.contract.dianzihetong')} key="1">
            {formContext?.data?.contractText?.contractName && (
              <div>
                <span style={{ marginRight: '12px' }}>{formContext?.data?.contractText.contractName}</span>
                <Button type="link">
                  <a type="link" target="_blank" href={formContext?.data?.contractText.contractUrl}>
                    {translate('web.common.yulan')}
                  </a>
                </Button>
              </div>
            )}
          </Tabs.TabPane>
        )}
      </Tabs>
    </MellowCard>
  )
}

export default ContractCard
