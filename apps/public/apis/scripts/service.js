const axios = require('axios').default

class Services {
	email = 'xjm871259169@dingtalk.com'
	password = '123456'
	request = axios.create({
		baseURL: 'http://10.0.1.181:7070/api',
	})
	cookieContent = ''
	constructor() {
		this.request.interceptors.response.use((res) => {
			const { data } = res
			return {
				data: data.data,
				headers: res.headers,
			}
		})
	}
	async init() {
		this.cookieContent = await this.login()
		this.request.defaults.headers.common.Cookie = this.cookieContent
	}

	async login() {
		const response = await this.request.post('/user/login', {
			email: this.email,
			password: this.password,
		})
		return response.headers['set-cookie'].join(';')
	}

	async getGroupList() {
		const { data } = await this.request.get('/group/list')
		return data
	}

	async getServiceList(groupId) {
		const { data } = await this.request.get('/project/list', {
			params: {
				group_id: groupId,
				page: 1,
				limit: 20,
			},
		})

		return data
	}

	async getServiceToken(groupId) {
		const { data } = await this.request.get('/project/token', {
			params: {
				project_id: groupId,
			},
		})
		return data
	}
}

module.exports = new Services()
