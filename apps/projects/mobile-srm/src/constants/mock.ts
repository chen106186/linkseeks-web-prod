export const mockApi = async (params: any) => {
  if (params?.current === 1) {
    return {
      code: 1000,
      data: {
        totalCount: 24,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    }
  }
  if (params?.current === 2) {
    return {
      code: 1000,
      data: {
        totalCount: 24,
        data: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      },
    }
  }
  if (params?.current === 3) {
    return {
      code: 1000,
      data: {
        totalCount: 24,
        data: [21, 22, 23, 24],
      },
    }
  }
}
