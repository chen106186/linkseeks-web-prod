import 'vitest'
import { TestingLibraryMatchers } from 'tsconfig/jest-matcher'

declare global {
  namespace Vi {
    interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  }
}
