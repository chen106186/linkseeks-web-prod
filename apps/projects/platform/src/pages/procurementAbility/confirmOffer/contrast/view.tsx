import React, { useState, useEffect, Fragment, useCallback } from 'react'
import { Tag, Badge, Tooltip, Button, Space } from 'antd'
import { Context, BidDetailContext } from '../../components/detail/components/context'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import PeripheralLayout from '../../components/detail'
import ProgressLayout from '../../components/detail/components/progressLayout'
import BasicLayout from '../../components/detail/components/basicLayout'
import ConditionLayout from '../../components/detail/components/conditionLayout'
import ContrastLyout from '../../components/detail/components/contrastLyout1'
import RecordLyout from '../../components/detail/components/recordLyout'
import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
} from '../../constants'
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import BidModal from '../../components/detail/modal'
import ModalOperate from '../../components/modalOperate'
import Bidmodal from '../../components/bidmodal'
import {
  getPurchaseConfirmQuotedPriceDetails,
  postPurchaseConfirmQuotedPriceStayExamineAward1,
  postPurchaseConfirmQuotedPriceStayExamineAward2,
} from '@apps/apis'
const intl = getIntl()
const ICONSTYLE: any = {
  color: '#C0C4CC',
  fontSize: '14px',
  marginLeft: '5px',
}

const TABLINK = [
  { key: 'progressLayout', label: intl.formatMessage({ id: 'detail.purchase.progressLayout' }) },
  { key: 'basicLayout', label: intl.formatMessage({ id: 'detail.purchase.basicLayout' }) },
  { key: 'conditionLayout', label: intl.formatMessage({ id: 'detail.purchase.conditionLayout' }) },
  { key: 'contrastLyout', label: intl.formatMessage({ id: 'detail.purchase.offerLayout' }) },
  { key: 'recordLyout', label: intl.formatMessage({ id: 'detail.purchase.recordLyout' }) },
]

const ContrastPrice = () => {
  const { id, turn } = useQuery()
  const { pathname } = useLocation()
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [auditDataSource, setAuditDataSource] = useState<any>([])
  const [link] = useState<string>(pathname.split('/')[pathname.split('/').length - 1])
  const [path] = useState<string>(pathname.split('/')[pathname.split('/').length - 2])
  const [companyJoinUs, setCompanyJoinUs] = useState<any>([])
  const [bid, setBid] = useState<any>({})
  const [disabled, setDisabled] = useState<boolean>(true)

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: intl.formatMessage({ id: 'table.purchase.dementNo' }), extra: data.purchaseInquiryNo },
          { label: intl.formatMessage({ id: 'table.purchase.details' }), extra: data.details },
          {
            label: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
            extra: <Tag color={OFFTER_EXTERNALSTATE_COLOR[data.externalState]}>{data.externalStateName}</Tag>,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.innerStatus' }),
            extra: <Badge status={OFFTER_INTERNALSTATE_COLOR[data.interiorState]} text={data?.interiorStateName} />,
          },
        ],
      },
      {
        col: [
          {
            label: (
              <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips' })}>
                {intl.formatMessage({ id: 'table.purchase.purchaseType' })}:<QuestionCircleOutlined style={ICONSTYLE} />
              </Tooltip>
            ),
            extra:
              data.purchaseType === 1
                ? intl.formatMessage({ id: 'detail.purchase.purchaseType1' })
                : intl.formatMessage({ id: 'detail.purchase.purchaseType2' }),
            colon: true,
          },
          {
            label: (
              <Tooltip placement="top" title={intl.formatMessage({ id: 'detail.purchase.tips1' })}>
                {intl.formatMessage({ id: 'detail.purchase.priceMethod' })}:<QuestionCircleOutlined style={ICONSTYLE} />
              </Tooltip>
            ),
            extra:
              data.priceContrast === 1
                ? intl.formatMessage({ id: 'detail.purchase.priceContrast1' })
                : intl.formatMessage({ id: 'detail.purchase.priceContrast2' }),
            colon: true,
          },
          { label: intl.formatMessage({ id: 'detail.purchase.memberName' }), extra: data.memberName },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.dementCreateTime' }),
            extra: formatTimeString(data.createTime),
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.areas' }),
            extra: (
              <div>
                {data.areas &&
                  data.areas.map((it: any, idx: number) => (
                    <p key={`areas${idx + 1}`}>{`${it.province}/${it.city}`}</p>
                  ))}
              </div>
            ),
          },
        ],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          {
            label: intl.formatMessage({ id: 'table.purchase.deliveryTime' }),
            extra: formatTimeString(data.deliveryTime),
          },
          { label: intl.formatMessage({ id: 'detail.purchase.address' }), extra: data.address },
          {
            label: intl.formatMessage({ id: 'table.purchase.quotedPriceTime' }),
            extra: formatTimeString(data.offerEndTime),
          },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.offerAsk' }), extra: data.offer },
          { label: intl.formatMessage({ id: 'detail.purchase.paymentType' }), extra: data.paymentType },
          { label: intl.formatMessage({ id: 'detail.purchase.taxesAsk' }), extra: data.taxes },
        ],
      },
      {
        col: [
          { label: intl.formatMessage({ id: 'detail.purchase.logisticsAsk' }), extra: data.logistics },
          { label: intl.formatMessage({ id: 'detail.purchase.packRequireAsk' }), extra: data.packRequire },
          { label: intl.formatMessage({ id: 'detail.purchase.otherRequireAsk' }), extra: data.otherRequire },
        ],
      },
    ])
  }

  const handleGetDataSource = async (trunId: string) => {
    const parmas = {
      id,
      turn: trunId,
    }
    await getPurchaseConfirmQuotedPriceDetails({ ...parmas })
      .then((res) => {
        if (res.code === 1000) {
          const { data } = res
          setDataSource(data)
          handleBasicEffect(data)
          handleConditionEffect(data)
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    handleGetDataSource(turn)
  }, [])

  const handleConfirm = () => {
    setVisible(false)
    history.goBack()
  }

  const handleContrastLyoutData = (data: any) => {
    console.log(data, 123)
    let company = []
    data[0].company.forEach((item) => {
      if (item.sumPrice) {
        company.push(
          `${item.memberName}（${intl.formatMessage({ id: 'detail.purchase.message25' })}：${intl.formatMessage({
            id: 'common.money',
          })}${item.sumPrice}）`,
        )
      }
    })
    setDisabled(false)
    setCompanyJoinUs(company)
    setAuditDataSource(data)
  }

  const fetchLink = () => {
    switch (path) {
      case 'auditResultsOne':
        return postPurchaseConfirmQuotedPriceStayExamineAward1
      case 'auditResultsTwo':
        return postPurchaseConfirmQuotedPriceStayExamineAward2
    }
  }

  useEffect(() => {
    if (link !== 'preview' && path === 'confirmResults') {
      setBid({
        id,
        awardResults: ` ${dataSource.createMemberName}《${dataSource.details}》${intl.formatMessage({
          id: 'common.letter1',
        })}:\n${intl.formatMessage({ id: 'common.letter2' })}: ${companyJoinUs.join(',')}\n${intl.formatMessage({
          id: 'common.letter3',
        })}：${dataSource.awardComments || ''}`,
        content: intl.formatMessage({ id: 'common.content', data: dataSource.details }),
      })
    }
  }, [visible, dataSource, companyJoinUs])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        backDom
        title={dataSource.purchaseInquiryNo}
        items={TABLINK}
        extra={
          link === 'preview' ? null : (
            <Button
              type="primary"
              // disabled={disabled}
              onClick={() => setVisible(true)}
            >
              <CheckCircleOutlined />
              {intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
            </Button>
          )
        }
      >
        <Space size={16} direction="vertical" style={{ display: 'flex', width: '100%' }}>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <ConditionLayout effect={conditionEffect} />
          <ContrastLyout
            isPath={path}
            isEdit={link === 'edit' && true}
            preview={link !== 'contrast' && link !== 'edit' ? true : false}
            query={{ id, turn }}
            redux={handleContrastLyoutData}
          />
          <RecordLyout />
        </Space>
      </PageHeaderWrapper>
      {(link === 'contrast' || link === 'edit') && (
        <BidDetailContext.Provider value={auditDataSource}>
          <BidModal
            id={id}
            turn={turn}
            visible={visible}
            handleConfirm={handleConfirm}
            onCancel={() => setVisible(false)}
          />
        </BidDetailContext.Provider>
      )}
      {link !== 'contrast' && path !== 'confirmResults' && link !== 'edit' && (
        <ModalOperate
          id={id}
          title={intl.formatMessage({ id: 'detail.purchase.modelTitle' })}
          modalType="audit"
          visible={visible}
          fetch={fetchLink()}
          onCancel={() => setVisible(false)}
          onOk={() => history.goBack()}
        />
      )}
      {link !== 'preview' && path === 'confirmResults' && (
        <Bidmodal bid={bid} visible={visible} cancel={() => setVisible(false)} />
      )}
    </Context.Provider>
  )
}
export default ContrastPrice
