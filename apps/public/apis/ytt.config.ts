const tokenList = require('./api.config')

const getConfigMap = (tokens: any[]) =>
  tokens.map((v) => ({
    serverUrl: 'http://192.168.110.15:3000/',
    typesOnly: false,
    reactHooks: {
      enabled: false,
    },
    // yapiMaps: true,
    outputFilePath: `./src/services/api-${v.name}`,
    requestFunctionFilePath: '../../request',
    dataKey: 'data',
    projects: [
      {
        token: v.token,
        categories: [
          {
            id: [0],
            getRequestFunctionName(interfaceInfo: any, changeCase: any) {
              return changeCase.camelCase(interfaceInfo.method + interfaceInfo.path)
            },
          },
        ],
      },
    ],
  }))

if (tokenList.length === 0) {
  console.log('--------本次无需更新任何接口--------')
}
export default getConfigMap(tokenList)
