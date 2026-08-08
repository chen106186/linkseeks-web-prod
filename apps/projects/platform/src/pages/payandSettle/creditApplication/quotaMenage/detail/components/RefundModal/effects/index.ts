import { useBusinessEffects } from './useBusinessEffects'

export const createEffects = (context, actions, billInfo?: any) => {
  context.billInfo = billInfo
  useBusinessEffects(context, actions)
}
