import React from 'react'
import { Card } from './Card'
import styles from './index.less'

export interface Item {
  id: number
  text: string
}

export interface ContainerState {
  cards: Item[]
}

interface Iprops {
  cards: any[]
  handleChangeShow: (index: number, isShow: boolean) => void
}

const Container: React.FC<Iprops> = (props) => {
  const { cards } = props

  return (
    <div className={styles['cart-container']}>
      {cards.map((card, index) => (
        <Card
          key={card.code}
          index={index}
          id={card.code}
          text={card.name}
          isShow={card.isShow}
          handleChangeShow={props.handleChangeShow}
        />
      ))}
    </div>
  )
}

export default Container
