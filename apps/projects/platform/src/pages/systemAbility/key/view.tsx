import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Typography } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { getManageSecretKeyGetSecretKey } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'

const Key = () => {
  const intl = useIntl()
  const [key, setKey] = useState<string>('')
  const [fmt, setFmt] = useState<string>('')
  const translate = useWebIntl()

  const countTime = () => {
    //获取当前时间
    const date = new Date()
    const now = date.getTime()
    //设置截止时间
    const end = sessionStorage.getItem('time') && Number(sessionStorage.getItem('time'))

    //时间差
    const leftTime = end - now
    //定义变量 d,h,m,s保存倒计时的时间
    let d, h, m, s
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
      h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
      m = Math.floor((leftTime / 1000 / 60) % 60)
      s = Math.floor((leftTime / 1000) % 60)
    }
    //递归每秒调用countTime方法，显示动态时间效果
    setFmt(
      `${d}${intl.formatMessage({ id: 'contract.tian' })}${h}${intl.formatMessage({
        id: 'selfManagement.hours',
      })}${m}${intl.formatMessage({
        id: 'member.components.MemberInvestigateInfo.score.unit',
      })}${s}${intl.formatMessage({ id: 'detail.purchase.second' })}`,
    )
    setTimeout(countTime, 1000)
  }
  const getSecretKey = async () => {
    await getManageSecretKeyGetSecretKey().then((res: any) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      setKey(data.secretKey)
      sessionStorage.setItem('time', data.effectiveTime)
    })
  }

  useEffect(() => {
    getSecretKey()
    countTime()
  }, [])

  return (
    <PageHeaderWrapper>
      <Card>
        <Row>
          <Col span={24} style={{ margin: '10px' }}>
            <Typography.Text style={{ display: 'flex', alignItems: 'center' }}>
              {intl.formatMessage({ id: 'systemSetting.key.decryptionKey' })}：
              <Typography.Paragraph
                style={{ marginBottom: '0', marginLeft: '24px' }}
                strong
                copyable={{
                  tooltips: [translate('web.common.copy'), translate('web.common.fuzhichenggong')],
                  icon: [
                    <Button style={{ marginLeft: '24px' }}>
                      {intl.formatMessage({ id: 'systemSetting.key.copyKey' })}
                    </Button>,
                    <Button style={{ marginLeft: '24px' }} type="primary">
                      {intl.formatMessage({ id: 'systemSetting.key.copyKey' })}
                    </Button>,
                  ],
                }}
              >
                {key}
              </Typography.Paragraph>
            </Typography.Text>
          </Col>
          <Col span={24} style={{ margin: '10px' }}>
            <Typography.Text>{`${intl.formatMessage({
              id: 'systemSetting.key.keyUsefulTime',
            })}：${fmt}`}</Typography.Text>
          </Col>
          <Col span={24} style={{ margin: '10px' }}>
            <Typography.Text>{intl.formatMessage({ id: 'systemSetting.key.resettingKey' })}</Typography.Text>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Key
