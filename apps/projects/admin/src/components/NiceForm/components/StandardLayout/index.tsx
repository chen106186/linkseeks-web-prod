import SchemaForm from '@apps/formily'
import './index.global.less'
import NiceForm from '../..'

const StandardLayout = (props) => {
  const { children, schema } = props
  return <div className="standard-layout">{children}</div>
}

StandardLayout.isVirtualFieldComponent = true

export default StandardLayout
