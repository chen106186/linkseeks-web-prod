import React from 'react'
import { Row, Col } from 'antd'
// import { InvoiceInfoProps } from '../../common/type';
import styles from './invoiceInfo.less'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

interface Iprops {
  props: {
    'x-component-props': {
      infos: {
        typeName: string
        kindName: string
        invoiceTitle: string
        taxNo: string
        bankOfDeposit: string
        account: string
        address: string
        tel: string
        originalProveList?: {
          number: number
          invoiceDate: string
          invoiceAmount: string
          remark: string
        }[]
      }
    }
  }
}

const infoList = [
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.typeName' }),
    dataIndex: 'typeName',
  },
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.kindName' }),
    dataIndex: 'kindName',
  },
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.invoiceTitle' }),
    dataIndex: 'invoiceTitle',
  },
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.taxNo' }),
    dataIndex: 'taxNo',
  },
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.bankOfDeposit' }),
    dataIndex: 'bankOfDeposit',
  },
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.account' }),
    dataIndex: 'account',
  },
  {
    title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.address' }),
    dataIndex: 'address',
  },
  { title: intl.formatMessage({ id: 'balance.components.invoiceCreate.invoiceInfo.infoList.tel' }), dataIndex: 'tel' },
]
const InvoiceInfo: React.FC<Iprops> & { isVirtualFieldComponent: boolean } = (props) => {
  console.log(props)
  const xComponentProps = props.props['x-component-props']
  const { infos } = xComponentProps

  return (
    <>
      {infoList.map((item) => {
        return (
          <Row className={styles.row} key={item.dataIndex}>
            <Col span={3} className={styles.label}>
              {item.title}
            </Col>
            <Col span={16}>{infos && infos[item.dataIndex]}</Col>
          </Row>
        )
      })}
      {infos?.originalProveList && (
        <div className={styles.originalInvoice}>
          <p className={styles.title}>{intl.formatMessage({ id: 'balance.yuandingdanfapiaoxinxi' })}</p>
          <div className={styles.header}>
            <div className={styles.defaultWidth}>{intl.formatMessage({ id: 'balance.yuandingdanfapiaohaoma' })}</div>
            <div className={styles.defaultWidth}>{intl.formatMessage({ id: 'balance.yuandingdankaipiaoriqi' })}</div>
            <div className={styles.defaultWidth}>{intl.formatMessage({ id: 'balance.yuandingdankaipiaojine' })}</div>
            <div className={styles.specialWidth}>{intl.formatMessage({ id: 'balance.beizhu' })}</div>
          </div>
          <div className={styles.list}>
            {infos.originalProveList.map((_item, key) => {
              return (
                <div className={styles.item} key={key}>
                  <div className={styles.defaultWidth}>{_item.number}</div>
                  <div className={styles.defaultWidth}>{_item.invoiceDate}</div>
                  <div className={styles.defaultWidth}>{_item.invoiceAmount}</div>
                  <div className={styles.specialWidth}>{_item.remark}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

InvoiceInfo.isVirtualFieldComponent = true

export default InvoiceInfo
