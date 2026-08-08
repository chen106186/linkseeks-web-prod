import React, { useState } from 'react'
import { ISchemaFieldComponentProps } from '@apps/formily'
import RiskCheck from '@/components/RiskCheck'

const SliderValidate = (props: ISchemaFieldComponentProps) => {
  const { value = [], mutators } = props
  const xPoint = 80
  const yPoint = 30
  const imgUrl =
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603280613858&di=b810f23b7c17affe6a2be8a28cecd857&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'
  const componentProps = {
    xPoint,
    yPoint,
    imgUrl,
  }
  return (
    <div>
      <RiskCheck {...componentProps} imgWidth={300} />
    </div>
  )
}

SliderValidate.defaultProps = {}

SliderValidate.isFieldComponent = true

export default SliderValidate
