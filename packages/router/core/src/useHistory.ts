import { useNavigate, useLocation } from 'react-router-dom'

const useHistory = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return {
    back: () => navigate(-1),
    goBack: () => navigate(-1),
    location,
    push: (url: string, state?: any) => navigate(url, { state }),
    replace: (url: string, state?: any) =>
      navigate(url, {
        replace: true,
        state,
      }),
  }
}

export default useHistory
