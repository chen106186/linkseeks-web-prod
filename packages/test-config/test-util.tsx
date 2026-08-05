// 公共测试工具函数
import React from 'react'

// 公共Wrapper组件
export const Wrapper = ({ children }) => <React.StrictMode>{children}</React.StrictMode>

// 公共模拟请求
export const mockSuccessRequest = vi.fn().mockResolvedValue({
  data: {
    data: [
      { id: 1, name: '测试用户1', age: 25 },
      { id: 2, name: '测试用户2', age: 30 },
    ],
    totalCount: 2,
  },
  code: 1000,
})

// 公共matchMedia模拟
export const setupMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
