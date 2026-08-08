import { useMemo } from 'react'
import { evalExpression, tokenize } from '@apps/design-utils'

export function useHiddenComponent(pageState: any, condition?: string) {
  return useMemo(
    () =>
      condition && condition.includes('$') ? tokenize(condition, pageState) : evalExpression(condition, pageState),
    [pageState, condition],
  )
}
