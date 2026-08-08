import { history } from '@linkseeks/router-manager'

export const useRouter = () => {
  const goBack = () => {
    history.goBack()
  }

  return {
    goBack,
  }
}
