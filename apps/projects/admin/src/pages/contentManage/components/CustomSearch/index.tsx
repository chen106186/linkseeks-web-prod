import React from 'react'
import { Input } from 'antd'
import styles from './styles.less'

const { Search } = Input

const CustomSearch = (props) => {
  const editable = props.editable
  const componentProps = props.props['x-component-props']
  const handleChange = (e) => {
    props.mutators.change(e.target.value)
  }

  return (
    <div className={styles.container}>
      <Search
        disabled={!editable}
        value={props.value}
        onChange={handleChange}
        {...componentProps}
        // onSearch={value => console.log(value)}
      />
    </div>
  )
}

CustomSearch.isFieldComponent = true

export default CustomSearch
