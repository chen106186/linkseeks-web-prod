import React from 'react'
import style from './index.less'

export interface FormDetailWrapperProps {}

const FormDetailWrapper:React.FC<FormDetailWrapperProps> = (props) => {
  return (
    <div className={style.wrapper}>
       <div className={style.anchorContentWrap}>
        {props.children}
       </div>
    </div>
  )
}

FormDetailWrapper.defaultProps = {}

export default FormDetailWrapper
