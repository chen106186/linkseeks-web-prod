import React from 'react'
import cx from 'classnames'
import LabelItem from './LabelItem'
import styles from './index.less'

export interface ClassifyLabelProps {
  className: string
  updateActiveType?: (type: number) => void
  activeType?: number
}

type ItemProps = {
  LabelItem: typeof LabelItem
}

const ClassifyLabel: React.FC<ClassifyLabelProps> & ItemProps = (props) => {
  const { children, activeType, updateActiveType, className, ...others } = props
  // const [activeType, seActiveType] = useState<number>(1);

  const classNameString = cx(styles['classify-label'], className)

  return (
    <div className={classNameString} {...others}>
      {children &&
        React.Children.map(children, (child: any) => {
          return React.cloneElement(child, {
            activeType,
            updateActiveType,
          })
        })}
    </div>
  )
}

ClassifyLabel.LabelItem = LabelItem

export default ClassifyLabel
