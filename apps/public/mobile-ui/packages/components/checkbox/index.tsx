/*
 * @Author: XieZhiXiong
 * @Date: 2021-02-03 11:17:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 21:19:52
 * @Description: 复选框
 */
import React, { useState, useEffect, useContext } from 'react'
import cx from 'classnames'
import Icons from '../icons'
import View from '../view'
import Text from '../text'
import CheckboxGroup, { CheckboxContext } from './group'
import { CheckboxProps } from '../../types/checkbox'

const Checkbox = (props: CheckboxProps) => {
  const { checked = false, value, style, onChange, color, size = 18, stopPropagation = false, children } = props
  const [check, setCheck] = useState(checked)
  const checkboxContext = useContext(CheckboxContext)

  const finalColor = color

  useEffect(() => {
    if ('checked' in props && !checkboxContext.toggleChange) {
      setCheck(checked)
    }
  }, [checked])

  useEffect(() => {
    if (checkboxContext.toggleChange) {
      const _valueArr = checkboxContext.value || []
      const isCheck = _valueArr.find((item) => item === value) !== undefined
      setCheck(isCheck)
    }
  }, [checkboxContext.value])

  const triggerChange = (flag: boolean) => {
    if (checkboxContext.toggleChange) {
      const newData = [...checkboxContext.value]
      if (flag) {
        newData.push(value)
      } else {
        const index = newData.findIndex((item) => item === value)
        if (index !== -1) {
          newData.splice(index, 1)
        }
      }
      checkboxContext.toggleChange(newData)
      return
    }
    if (onChange) {
      onChange(flag)
    }
  }

  const handleClick = (e: any) => {
    if (stopPropagation) {
      e.stopPropagation()
    }
    const flag = !check
    if (!('value' in props) && !checkboxContext.toggleChange) {
      setCheck(flag)
    }
    triggerChange(flag)
  }

  const contentNode = typeof children === 'string' ? <Text className="checkbox-label">{children}</Text> : children

  const mergeStyle = Object.assign(
    {
      width: size,
      height: size,
    },
    check
      ? {
          backgroundColor: finalColor,
          borderColor: finalColor,
        }
      : null,
  )

  return (
    <View className="checkbox" style={style} onClick={handleClick}>
      <View className={cx('checkbox-icon', check ? 'checkbox-icon__check' : '')} style={mergeStyle}>
        <Icons
          name="Right"
          size={size - 4}
          color="#FFFFFF"
          customStyle={{
            opacity: check ? 1 : 0,
          }}
        />
      </View>
      {!!children && contentNode}
    </View>
  )
}

Checkbox.defaultProps = {
  onChange: undefined,
  size: 18,
  children: null,
}

Checkbox.Group = CheckboxGroup

export default Checkbox
