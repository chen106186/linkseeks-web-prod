import { useLocation } from 'react-router-dom'

const formatSearch = (se) => {
  if (typeof se !== 'undefined') {
    se = se.substr(1)
    var arr = se.split('&'),
      obj: any = {},
      newarr = []
    arr?.forEach((v) => {
      newarr = v.split('=')
      if (typeof obj[newarr[0]] === 'undefined') {
        obj[newarr[0]] = decodeURIComponent(newarr[1])
      }
    })
    return obj
  }
}

const useQuery = () => {
  const { search } = useLocation()
  return formatSearch(search)
}

export default useQuery
