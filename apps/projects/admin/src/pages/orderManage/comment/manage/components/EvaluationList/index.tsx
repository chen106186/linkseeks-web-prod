import { Button } from 'antd'
import { SchemaField, ArrayList, toArr, FormPath } from '@apps/formily'
import { checkIsPointsOrder } from '@/constants/const/order'
import SmilingFace from '@/components/NiceForm/components/SmilingFace'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

const ArrayComponents = {
  CircleButton: (props) => <Button {...props} />,
  TextButton: (props) => <Button text {...props} />,
  AdditionIcon: () => <div>+Add</div>,
  RemoveIcon: () => <div>Remove</div>,
  MoveDownIcon: () => <div>Down</div>,
  MoveUpIcon: () => <div>Up</div>,
}

const EvaluationList = (props) => {
  const { value, schema, editable, path } = props
  const {
    renderAddition,
    renderRemove,
    renderMoveDown,
    renderMoveUp,
    renderEmpty,
    renderExtraOperations,
    ...componentProps
  } = schema.getExtendsComponentProps() || {}

  return (
    <ArrayList
      value={value}
      minItems={schema.minItems}
      maxItems={schema.maxItems}
      editable={editable}
      components={ArrayComponents}
    >
      {toArr(value).map((item, index) => {
        return (
          <MellowCard className={styles['et-product-wrap']}>
            <div className={styles['et-product']}>
              <div className={styles['et-product-left']}>
                <img src={item.good ? item.good.pic : ''} />
              </div>
              <div className={styles['et-product-right']}>
                <div className={styles['et-product-title']}>{item.good?.productName}</div>
                <div className={styles['et-product-price']}>
                  <span className={styles['et-product-money']}>
                    {`${!checkIsPointsOrder(item.orderType) ? '¥' : ''} ${item.totalPrice} ${
                      checkIsPointsOrder(item.orderType) ? '积分' : ''
                    }`}
                  </span>
                  <span className={styles['et-product-desc']}>
                    {`${!checkIsPointsOrder(item.orderType) ? '¥' : ''} ${item.good?.price}${
                      checkIsPointsOrder(item.orderType) ? '积分' : ''
                    }/${item.good?.unit || ''}，`}
                    共 {item.good?.purchaseCount || ''}
                    {item.good?.unit || ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="main">
              <SchemaField path={FormPath.parse(path).concat(index)} />
            </div>
            <div className={styles['et-product-smile']}>
              <SmilingFace value={item.smile} />
            </div>
          </MellowCard>
        )
      })}
    </ArrayList>
  )
}

EvaluationList.isFieldComponent = true

export default EvaluationList
