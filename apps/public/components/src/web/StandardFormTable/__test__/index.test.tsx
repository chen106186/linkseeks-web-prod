import { act, render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { TableContainer as StandardFormTable } from '../standardFormTable'
import React from 'react'
import './init'
vi.mock('@linkseeks/router-core', async () => {
  return {
    getCurrentRouter: vi.fn().mockReturnValue({
      cache: false,
    }),
  }
})
// 模拟 hooks
// vi.mock('./hooks/useFetchList', () => ({
// 	useFetchList: vi.fn().mockReturnValue({
// 		pagination: { current: 1, pageSize: 10, total: 2 },
// 		searchForm: {
// 			submit: vi.fn(),
// 			reset: vi.fn(),
// 			reload: vi.fn()
// 		},
// 		resetTableProps: {}
// 	})
// }))

// 模拟表格请求
const mockSuccessRequest = vi.fn().mockResolvedValue({
  data: {
    data: [
      { id: 1, name: '测试用户1', age: 25 },
      { id: 2, name: '测试用户2', age: 30 },
    ],
    totalCount: 2,
  },
  code: 1000,
})

describe('基础数据渲染测试', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('应正确显示请求数据', async () => {
    act(() => {
      render(
        <StandardFormTable
          request={mockSuccessRequest}
          columns={[
            { key: 'name', title: '姓名' },
            { key: 'age', title: '年龄' },
          ]}
          rowKey="id"
        />,
      )
    })

    // 修改断言方式
    await waitFor(() => {
      expect(mockSuccessRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          current: 1,
          pageSize: 10,
        }),
      )
    })

    // 等待数据渲染
    await waitFor(() => {
      // 验证列标题
      expect(screen.getByText('姓名')).toBeInTheDocument()
      expect(screen.getByText('年龄')).toBeInTheDocument()

      // 验证数据行
      expect(screen.getByText('测试用户1')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument()
    })
  })
})
