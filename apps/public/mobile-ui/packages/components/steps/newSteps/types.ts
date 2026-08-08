import { ReactNode } from 'react'

export interface StepsProps {
  current?: number
  direction?: 'horizontal' | 'vertical'
}

export interface StepProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  status?: 'wait' | 'process' | 'finish' | 'error'
}
