import { useState } from 'react'

const useCpecialPage = () => {
  const [loading, setLoading] = useState<boolean>()
  const [dataSource, setDataSource] = useState([])
  const [total, setTotal] = useState<number>(0)
  const [currentPageSize, setCurrentPageSize] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const onPageChange = (page: number, pageSize: number) => {
    setCurrentPageSize(pageSize)
    setCurrentPage(page)
  }

  return {
    total,
    dataSource,
    loading,
    currentPage,
    currentPageSize,
    onPageChange,
  }
}

export default useCpecialPage
