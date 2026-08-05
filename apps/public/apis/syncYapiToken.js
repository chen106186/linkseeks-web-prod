const axios = require('axios')
const fse = require('fs-extra')
const path = require('path')

const YAPI_URL = 'http://192.168.110.15:3000'
const EMAIL = 'admin@admin.com'
const PASSWORD = '123456'
const OUT_PATH = path.resolve(__dirname, './yapiToken.json')

const request = axios.create({ baseURL: YAPI_URL, proxy: false })

async function login() {
  const res = await request.post('/api/user/login', { email: EMAIL, password: PASSWORD })
  if (res.data.errcode !== 0) throw new Error('登录失败: ' + res.data.errmsg)
  const cookie = res.headers['set-cookie'].join(';')
  request.defaults.headers.common['Cookie'] = cookie
  console.log('登录成功')
  return cookie
}

async function getGroupList() {
  const res = await request.get('/api/group/list')
  if (res.data.errcode !== 0) throw new Error('获取分组列表失败: ' + res.data.errmsg)
  return res.data.data
}

async function getProjectList(groupId, page = 1, limit = 50) {
  const res = await request.get('/api/project/list', {
    params: { group_id: groupId, page, limit },
  })
  if (res.data.errcode !== 0) return []
  return res.data.data.list || []
}

async function getProjectToken(projectId) {
  const res = await request.get('/api/project/token', {
    params: { project_id: projectId },
  })
  if (res.data.errcode !== 0) return null
  return res.data.data
}

async function main() {
  await login()

  const groups = await getGroupList()
  console.log(`找到 ${groups.length} 个分组:`, groups.map((g) => g.group_name).join(', '))

  const allProjects = []
  for (const group of groups) {
    const projects = await getProjectList(group._id)
    console.log(`分组「${group.group_name}」下有 ${projects.length} 个项目`)
    allProjects.push(...projects)
  }

  console.log(`\n共找到 ${allProjects.length} 个项目，开始获取 token...\n`)

  // 读取现有 yapiToken.json，保留 updateTime
  let existing = {}
  try {
    existing = fse.readJsonSync(OUT_PATH)
  } catch {}

  const result = {}
  for (const project of allProjects) {
    const token = await getProjectToken(project._id)
    if (!token) {
      console.log(`  ✗ ${project.name} - 获取 token 失败`)
      continue
    }
    result[project.name] = {
      token,
      updateTime: project.up_time || Date.now(),
      needUpdate: true,
    }
    console.log(`  ✓ ${project.name}`)
  }

  fse.writeJsonSync(OUT_PATH, result, { spaces: 2 })
  console.log(`\n✅ 已写入 yapiToken.json，共 ${Object.keys(result).length} 个服务`)

  // 检查 index.ts 里引用的服务是否都存在
  const missing = Object.keys(existing).filter((name) => !result[name])
  if (missing.length > 0) {
    console.log('\n⚠️  以下服务在 YAPI 中未找到:', missing.join(', '))
  }
}

main().catch((err) => {
  console.error('❌ 出错:', err.message)
  process.exit(1)
})
