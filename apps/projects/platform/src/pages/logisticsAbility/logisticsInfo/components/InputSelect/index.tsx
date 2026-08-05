import React, { forwardRef, Fragment } from 'react'
import { Input } from 'antd'
import cx from 'classnames'
import style from './index.less'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
interface InputSelectPropsType {
  dataSource: Array<string>
  onAdded?: Function
  onReduce?: Function
  onChange?: Function
}

const InputCascader: React.FC<InputSelectPropsType> = (props: any) => {
  const { dataSource, onAdded, onReduce, onChange } = props
  const intl = useIntl()

  const handleAddNewSelect = () => {
    onAdded('')
  }

  const handleReduceSelect = (index: number) => {
    if (dataSource.length > 1) {
      onReduce(index)
    }
  }

  const handleChangeInput = (e: any, index: number) => {
    const { value } = e.target
    const newData = [...dataSource]
    newData[index] = value
    onChange(newData)
  }

  return (
    <Fragment>
      {dataSource &&
        dataSource.map((item: any, index: number) => (
          <div className={style.input_select_line} key={`inputDataItem-${index}`}>
            <Input
              placeholder={intl.formatMessage({ id: 'components.zuichang20gezifu10' })}
              style={{ width: 572, marginRight: 24 }}
              value={item}
              onChange={(value) => handleChangeInput(value, index)}
            />
            {index === dataSource.length - 1 && (
              <div className={cx(style.opration_btn, style.add)} onClick={() => handleAddNewSelect()}>
                <PlusOutlined />
              </div>
            )}
            <div className={style.opration_btn} onClick={() => handleReduceSelect(index)}>
              <MinusOutlined />
            </div>
          </div>
        ))}
    </Fragment>
  )
}

const InputSelect: React.FC<InputSelectPropsType> = forwardRef((props) => {
  const { dataSource, onAdded, onReduce, onChange } = props
  return (
    <div>
      <InputCascader dataSource={dataSource} onAdded={onAdded} onReduce={onReduce} onChange={onChange} />
    </div>
  )
})

InputSelect.displayName = 'InputSelect'

export default InputSelect
