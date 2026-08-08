const usePageQuery = (search: string) => {
  const formatSearch = (se: string) => {
    if (typeof se !== 'undefined') {
      se = se.substring(1)
      var arr = se.split('&'),
        obj: any = {},
        newarr: string[] = []
      arr?.forEach((v) => {
        newarr = v.split('=')
        if (typeof obj[newarr[0]] === 'undefined') {
          obj[newarr[0]] = decodeURIComponent(newarr[1])
        }
      })
      return obj
    }
  }

  return formatSearch(search)
}

export default usePageQuery
