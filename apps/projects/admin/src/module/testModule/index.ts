export interface ITestModule {
  testList: string[]
  testText: string
  testNumber: number

  printInfo: string

  setText(testText: string): void
  setNumber(testNumber: number): void
  getAsyncInfo(): Promise<string[]>
}
