import React from 'react'

interface Iprops {
  value: any,
  props: {
    'x-component-props': {
      isImage?: boolean,
      [key: string]: any
    }
  }
}

const ReadOnly: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value } = props;
  const componentProps = props.props?.['x-component-props'] || {}
  return (
    <>
    {
      value && componentProps?.isImage && (
        <img src={value} style={{width: '32px', height: '32px'}} />
      ) || (
        <div>{value}</div>
      )
    }
    </>
  )
}

ReadOnly.isFieldComponent = true

export default ReadOnly
