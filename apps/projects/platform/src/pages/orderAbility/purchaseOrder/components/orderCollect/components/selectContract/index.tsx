import { history } from '@linkseeks/router-manager'
import { Button, Checkbox, Modal } from 'antd'
import { ISchemaFieldComponentProps } from '@apps/formily'
import { FilePdfFilled } from '@ant-design/icons'
import { getContractSignatureAuthAuthStatus } from '@apps/apis'

const SelectContract = (props: ISchemaFieldComponentProps) => {
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
            title: '提示',
            content: '未签约电子合同, 是否要立即前往?',
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
      <Checkbox onChange={onChange}>同意</Checkbox>
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
