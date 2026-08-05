const service = require('./service')
const fs = require('fs')
const path = require('path')

const root = process.cwd()
async function main() {
	await service.init()
	// 获取左侧分组列表 如 0618 0718
	const groupList = await service.getGroupList()

	// 获取分组下 所有服务列表和token
	const result = await Promise.all(
		groupList.map(async (v) => {
			// 根据groupid 获取service
			const { list } = await service.getServiceList(v._id)
			const serviceList = await Promise.all(
				list.map(async (i) => {
					const token = await service.getServiceToken(i._id)
					return {
						name: i.name,
						token,
					}
				})
			)

			return {
				name: v.group_name,
				serviceList,
			}
		})
	)

	const verResult = result.find((v) => v.name === '瓴犀项目-v2-718')
	const output = `
  module.exports = ${JSON.stringify(verResult.serviceList)}
  `
	fs.writeFile(path.resolve(root, 'api.config.js'), output, function (err) {
		if (err) throw err

		console.log('write api.config.js success')
	})

	fs.writeFile(
		path.resolve(root, 'src/index.ts'),
		`
  export * from './inject'
  ${verResult.serviceList.reduce((p, n) => {
		p += `export * from './services/api-${n.name}'\n`
		return p
	}, '')}
  `,
		function (err) {
			if (err) throw err

			console.log('write index success')
		}
	)
}

main()
