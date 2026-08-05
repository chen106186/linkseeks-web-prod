import React from 'react'
import evaluate from './stars.png'
import unEvaluate from './starsUn.png'
import styles from './index.module.less'

interface Props {
  identification: string // 满意程度
  hasKey?: boolean
}

function Satisfaction(props: Props) {
  const { identification = 1, hasKey = true } = props
  const evaluateList = [1, 2, 3, 4, 5]
  return (
    <div className={styles['enterprises-warp']}>
      {hasKey && <span className={styles['enterprises-key']}>满意度：</span>}
      <div className={styles['enterprises-evaluate']} style={{ backgroundColor: hasKey ? '' : 'rgba(0, 0, 0, 0.04)' }}>
        <span className={styles['enterprises-value']}> {identification} </span>
        {evaluateList.map((index: number) => {
          let numberDesc = Number(identification)
          if (!numberDesc) {
            numberDesc = 1
          }
          if (numberDesc >= index) {
            return <img src={evaluate} alt="" key={index + 'satisfaction'} />
          } else {
            return <img src={unEvaluate} alt="" key={index + 'satisfaction'} />
          }
        })}
      </div>
    </div>
  )
}

export default Satisfaction
