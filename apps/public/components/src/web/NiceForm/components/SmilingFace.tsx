import React from 'react'
import Mood from '../../Mood'
const SmilingFace = (props: any) => {
  const { value, ...componentProps } = props

  let node: any = null

  switch (value) {
    case 0:
    case 1:
    case 2: {
      node = (
        <div {...componentProps}>
          {/* <Mood type="sad" customStyle={{ marginRight: 8 }} /> */}
          <span>差评</span>
        </div>
      )
      break
    }

    case 3: {
      node = (
        <div {...componentProps}>
          <Mood type="notBad" customStyle={{ marginRight: 8 }} />
          <span>中评</span>
        </div>
      )
      break
    }

    case 4:
    case 5: {
      node = (
        <div {...componentProps}>
          <Mood type="smile" customStyle={{ marginRight: 8 }} />
          <span>好评</span>
        </div>
      )
      break
    }

    default:
      break
  }
  return node
}

SmilingFace.isFieldComponent = true

export default SmilingFace
