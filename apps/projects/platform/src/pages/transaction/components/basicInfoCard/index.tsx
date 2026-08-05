import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Col, Form, Popover, Row, Typography } from 'antd'
import MellowCard from '@/components/MellowCard'
import { useWebIntl } from '@apps/locales'
import { OrderDetailContext } from '../../_public/order/context'
import { ALTERATION } from '../orderDetailSection'
import { formatContext } from '../../../orderAbility/components/purchaseOrderPreview'
import { isEmpty } from 'lodash'
import RadioChangeButtonCard from '../radioChangeButton'
import { EditCircleFillIcon } from '@linkseeks/icons'
import { titleCase } from '../renderCard'
import styles from './index.less'

const RenderCard = ({ infoList, dataSource, colSpan = 12, versionContext, alteation }) => {
  const translate = useWebIntl()

  return (
    <Row gutter={[128, 16]}>
      {!isEmpty(dataSource) &&
        infoList.map((v, i) => (
          <Fragment key={`${v.name}_${i + 1}`}>
            {dataSource[v.name] && (
              <Col span={colSpan}>
                <Form.Item
                  label={v.title}
                  labelCol={{ style: { width: '144px' } }}
                  labelAlign="left"
                  style={{ marginBottom: 0 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {v.render ? v.render(dataSource[v.name], dataSource) : dataSource[v.name]}
                    {versionContext &&
                    alteation === ALTERATION.AFTER_ALTERATION &&
                    versionContext?.detailBO[v.name + 'ChangeStatus'] ? (
                      <Popover
                        overlayClassName={styles['popover']}
                        title={
                          <>
                            <EditCircleFillIcon style={{ color: '#4888F0', fontSize: '16px' }} />
                            <Typography.Text>{translate('web.common.shujuyibiangeng')}</Typography.Text>
                          </>
                        }
                        content={versionContext?.detailBO['before' + titleCase(v.name)]}
                      >
                        <EditCircleFillIcon style={{ color: '#4888F0', fontSize: '16px' }} />
                      </Popover>
                    ) : null}
                  </div>
                </Form.Item>
              </Col>
            )}
          </Fragment>
        ))}
    </Row>
  )
}

interface BasicInfoCardLayoutProps {
  /**
   * 列表
   */
  detailList?: any[]
}

const BasicInfoCardLayout: React.FC<BasicInfoCardLayoutProps> = (props) => {
  const { detailList } = props
  const { versionContext, formContext } = useContext(OrderDetailContext)
  const [alteation, setAlteation] = useState<number>(ALTERATION.AFTER_ALTERATION)
  const [dataBo, setDataBo] = useState<any>()
  const translate = useWebIntl()

  const infoList = [
    { title: translate('web.resource.order.dingdanzhaiyao'), name: 'digest' },
    { title: translate('web.resource.order.duiyinghetongbianhao'), name: 'contractNo' },
    { title: translate('web.resource.order.xiadanshijian'), name: 'createTime' },
    { title: translate('web.resource.order.biangengshijian'), name: 'changeTime' },
    { title: translate('web.resource.order.biangengshenhetongguoshijian'), name: 'verifiedTime' },
  ]

  const handRenderValue = (value) => {
    const { digest, digestChangeStatus, contractNoChangeStatus } = formatContext(versionContext, value)

    setDataBo({
      digest,
      digestChangeStatus,
      contractNoChangeStatus,
      createTime: formContext?.data?.createTime,
      verifiedTime: versionContext?.detailBO?.verifiedTime,
      changeTime: versionContext?.detailBO?.changeTime,
    })
  }

  const handleVersions = (e) => {
    const { value } = e.target
    if (value === ALTERATION.BEFORE_ALTERATION) {
      handRenderValue('before')
    } else {
      handRenderValue('after')
    }
    setAlteation(value)
  }

  useEffect(() => {
    if (versionContext) {
      setAlteation(ALTERATION.AFTER_ALTERATION)
      handRenderValue('after')
    }
  }, [versionContext])

  return (
    <MellowCard
      id="basicInfo"
      title={translate('web.common.jibenxinxi')}
      extra={versionContext && <RadioChangeButtonCard handleVersions={handleVersions} />}
    >
      <RenderCard
        infoList={versionContext ? infoList : detailList}
        dataSource={versionContext ? dataBo : formContext?.data}
        versionContext={versionContext}
        alteation={alteation}
      />
    </MellowCard>
  )
}

export default BasicInfoCardLayout
