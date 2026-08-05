import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Checkbox, Modal } from 'antd'
import { ISchemaFieldComponentProps } from '@apps/formily'
import { FilePdfFilled } from '@ant-design/icons'
import { getContractSignatureAuthAuthStatus } from '@apps/apis'

const SelectContract = (props: ISchemaFieldComponentProps) => {
  const intl = useIntl()
  let { form, value = {}, mutators, editable } = props

  const popConfirm = () => {
    history.push(`/contract/ElectronicSignature/apply`)
  }

  const onChange = (e) => {
    if (e.target.checked) {
      getContractSignatureAuthAuthStatus().then(({ data }) => {
        if (!data) {
          // 未认证
          Modal.confirm({
            title: intl.formatMessage({ id: 'purchaseOrder.notice' }),
            content: intl.formatMessage({ id: 'purchaseOrder.orderCollect.selectContract.content' }),
            onOk: popConfirm,
            maskClosable: true,
          })
        } else {
          mutators.change(1)
        }
      })
    } else {
      mutators.change(0)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox onChange={onChange}>{intl.formatMessage({ id: 'purchaseOrder.consent' })}</Checkbox>
      <Button
        type="link"
        icon={<FilePdfFilled />}
        style={{ color: '#7178ea' }}
        href={`/api/order/contractTemplate/downloadContract?contractName=${props.props['x-component-props'].contract.contractName}&fileUrl=${props.props['x-component-props'].contract.contractUrl}`}
      >
        {props.props['x-component-props'].contract?.contractName}
      </Button>
    </div>
  )
}

SelectContract.defaultProps = {}

SelectContract.isFieldComponent = true

export default SelectContract
