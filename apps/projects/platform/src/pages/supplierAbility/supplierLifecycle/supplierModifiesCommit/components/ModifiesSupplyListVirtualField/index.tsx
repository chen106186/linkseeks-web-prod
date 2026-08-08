/*
 * @Description: 货源清单虚拟组件
 */
import React from 'react'
import ModifiesSupplyList from '../../../components/ModifiesSupplyList'

interface ModifiesSupplyListVirtualFieldProps {}

const ModifiesSupplyListVirtualField = (props) => {
  const { schema } = props
  const componentProps: ModifiesSupplyListVirtualFieldProps = schema.getExtendsComponentProps() || {}

  return <ModifiesSupplyList data={{}} />
}

ModifiesSupplyListVirtualField.isVirtualFieldComponent = true

export default ModifiesSupplyListVirtualField
