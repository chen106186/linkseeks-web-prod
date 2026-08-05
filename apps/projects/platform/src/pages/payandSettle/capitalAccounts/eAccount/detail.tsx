import { PageHeaderWrapper, CardWrapper } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { FormItemWrapper, FormLayoutWrapper } from '@apps/services/commodity'
import { ArrowCircleRightIcon } from '@linkseeks/icons'
import { Button, Descriptions, Space } from '@linkseeks/ui'
import styles from './index.less'
import { InitContextProvider, useEAccountInitContext } from './context'
import { useEffect } from 'react'
import { postPayAllInPaySignContractQuery } from '@apps/apis'
import { useHistory } from '@linkseeks/router-core'
const Detail = () => {
  const translate = useWebIntl()
  const { memberInfo, refreshPayMemberInfo, isSelf, isEnterprise, isFinishProcess } = useEAccountInitContext()
  const history = useHistory()

  const handleOpenSelfAccount = () => {
    history.replace('/payandSettle/capitalAccounts/eAccount/register')
  }

  const openAgreement = async () => {
    const { data } = await postPayAllInPaySignContractQuery(
      {
        jumpUrl: location.href,
        // 企业会员就传3，否则是个人会员就传1
        accountType: isEnterprise ? 3 : 1,
      },
      { ctlType: 'none' },
    )
    location.replace(data)
  }

  const renderSelf = () => {
    return (
      <>
        <CardWrapper title={translate('web.common.jibenxinxi')}>
          <Descriptions labelStyle={{ alignItems: 'center' }} column={2}>
            {isFinishProcess && (
              <Descriptions.Item label="姓名">
                <span>{memberInfo?.name}</span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="手机号">
              <Space>
                <span>{memberInfo?.phone}</span>
                {/* <Button type="link">换绑 &gt;</Button> */}
              </Space>
            </Descriptions.Item>
            {!isFinishProcess && (
              <Descriptions.Item>
                <div className={styles['detail-block']} onClick={handleOpenSelfAccount}>
                  <div className={styles['detail-title']}>
                    <span>开通通联账户</span>
                    <ArrowCircleRightIcon className={styles['detail-icon']} />
                  </div>
                  <div className={styles['detail-tip']}>开通后可充值到通联余额，使用余额消费及提现</div>
                </div>
              </Descriptions.Item>
            )}

            {isFinishProcess && (
              <>
                <Descriptions.Item label="证件类型">
                  <span>身份证</span>
                </Descriptions.Item>
                <Descriptions.Item label="证件号码">
                  <span>{memberInfo?.identityCardNo}</span>
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </CardWrapper>

        <CardWrapper title="银行卡">
          <Descriptions>
            <Descriptions.Item label="银行卡号">
              <span>{memberInfo?.accountNo || memberInfo?.bankNo}</span>
            </Descriptions.Item>
          </Descriptions>
        </CardWrapper>
        <CardWrapper title="提现协议">
          <Descriptions>
            <Descriptions.Item label="电子协议">
              <Button type="link" onClick={openAgreement}>
                查看协议 - {memberInfo?.acctProtocolNo}
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </CardWrapper>
      </>
    )
  }

  const renderEnterprise = () => {
    return (
      <>
        <CardWrapper title="认证信息">
          <Descriptions labelStyle={{ alignItems: 'center' }} column={2}>
            <Descriptions.Item label="企业名称">
              <span>{memberInfo?.companyName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="统一社会信用代码">
              <span>{memberInfo?.uniCredit}</span>
            </Descriptions.Item>
            <Descriptions.Item label="法人姓名">
              <span>{memberInfo?.legalName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="法人手机号">
              <span>{memberInfo?.legalPhone}</span>
            </Descriptions.Item>
            <Descriptions.Item label="证件类型">
              <span>身份证</span>
            </Descriptions.Item>
            <Descriptions.Item label="法人证件号">
              <span>{memberInfo?.legalIds}</span>
            </Descriptions.Item>
            <Descriptions.Item label="企业对公账户">
              <span>{memberInfo?.accountNo}</span>
            </Descriptions.Item>
            <Descriptions.Item label="开户行名称">
              <span>{memberInfo?.branchName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="开户银行名称">
              <span>{memberInfo?.bankName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="支行行号">
              <span>{memberInfo?.unionBank}</span>
            </Descriptions.Item>
          </Descriptions>
        </CardWrapper>

        <CardWrapper title={'绑定手机'}>
          <Descriptions labelStyle={{ alignItems: 'center' }} column={2}>
            <Descriptions.Item label="手机号">
              <Space>
                <span>{memberInfo?.phone}</span>
                {/* <Button type="link">换绑 &gt;</Button> */}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </CardWrapper>

        <CardWrapper title="提现协议">
          <Descriptions>
            <Descriptions.Item label="电子协议">
              <Button type="link" onClick={openAgreement}>
                查看协议 - {memberInfo?.acctProtocolNo}
              </Button>
            </Descriptions.Item>
          </Descriptions>
        </CardWrapper>
      </>
    )
  }
  return (
    <PageHeaderWrapper>
      {isSelf && renderSelf()}

      {isEnterprise && renderEnterprise()}
    </PageHeaderWrapper>
  )
}

export default () => (
  <InitContextProvider>
    <Detail />
  </InitContextProvider>
)
