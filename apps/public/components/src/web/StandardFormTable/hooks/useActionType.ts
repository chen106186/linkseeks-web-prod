import { ActionType } from '../types'

const useActionType = (ref: React.MutableRefObject<ActionType | undefined>, actions: ActionType) => {
  const userAction: ActionType = {
    ...actions,
  }

  ref.current = userAction
}

export default useActionType
