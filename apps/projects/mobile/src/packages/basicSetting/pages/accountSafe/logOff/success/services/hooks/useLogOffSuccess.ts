import useStores from '@/store/useStores'
import useJmpHome from '@/hooks/useJmpHome'

const useLogOffSuccess = () => {
  const {
    userStore: { removeUserInfo },
  } = useStores()
  const { jmpHome } = useJmpHome()

  const onSuccess = () => {
    removeUserInfo()
    jmpHome()
  }

  return {
    onSuccess,
  }
}

export default useLogOffSuccess
