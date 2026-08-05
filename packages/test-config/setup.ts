import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import createFetchMock from 'vitest-fetch-mock'
import * as matchers from '@testing-library/jest-dom/matchers'
import { TestingLibraryMatchers } from 'tsconfig/jest-matcher'

const fetchMocker = createFetchMock(vi)

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks()
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}
// 继承 testing-library 的扩展 except
expect.extend(matchers)
// 全局设置清理函数，避免每个测试文件手动清理
afterEach(() => {
  cleanup()
})
