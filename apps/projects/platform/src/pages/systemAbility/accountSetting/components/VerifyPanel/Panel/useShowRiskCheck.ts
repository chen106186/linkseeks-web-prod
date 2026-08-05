import React, { useState } from 'react'

function useShowRiskCheck(key: string = 'captcha') {
  const [canShowRiskCheck, setCanShowRiskCheck] = useState(false)

  const onValuesChange = (changedValues) => {
    if (key in changedValues) {
      if (changedValues[key]) {
        setCanShowRiskCheck(true)
      } else {
        setCanShowRiskCheck(false)
      }
    }
  }

  return { canShowRiskCheck, onValuesChange }
}

export default useShowRiskCheck
