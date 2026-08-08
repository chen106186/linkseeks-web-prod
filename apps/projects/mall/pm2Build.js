import pm2 from 'pm2'
import path from 'path'

const pm2Script = process.env.LX_PM2_SCRIPT
const pm2Name = process.env.LX_PM2_SCRIPT_NAME
const pm2Instance = process.env.LX_PM2_INSTANCE || 2

const cwdPath = path.resolve(process.cwd(), pm2Script)

console.log(cwdPath)
console.log(process.env.BACK_GATEWAY)
console.log(process.env.MEMBER_URL)
if (!pm2Script || !pm2Name) {
  console.error('请检查是否通过cross-env传入LX_PM2_SCRIPT以及LX_PM2_SCRIPT_NAME环境变量')
  process.exit(1)
}
pm2.connect(function (err) {
  if (err) {
    console.log(error)
    process.exit(2)
  }

  findPm2Process(pm2Name).then((res) => {
    if (res) {
      // 进程已经存在 需要重启
      pm2.restart(pm2Name, function (err, proc) {
        showPm2List().then(() => {
          pm2.disconnect()
        })
      })
    } else {
      // 进程不存在
      pm2.start(
        {
          script: pm2Script,
          name: pm2Name,
          instances: pm2Instance,
          merge_logs: true,
          env: {
            BACK_GATEWAY: process.env.BACK_GATEWAY,
            MEMBER_URL: process.env.MEMBER_URL,
            SOCKET_URL: process.env.SOCKET_URL,
          },
        },
        function (err, app) {
          if (err) {
            console.error(err)
            process.exit(1)
          }
          showPm2List().then(() => {
            pm2.disconnect()
          })
        },
      )
    }
  })
})

function findPm2Process(processName) {
  return new Promise((resolve, reject) => {
    pm2.list(function (err, list) {
      if (err) {
        reject()
      }
      const res = list.find((v) => v.name === processName)
      resolve(!!res)
    })
  })
}

function showPm2List() {
  return new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      const tableList = list.map((v) => {
        const res = {
          id: v.pm_id,
          pid: v.pid,
          name: v.name,
          memory: v.monit.memory,
          status: v.pm2_env.status,
        }
        return res
      })
      console.table(tableList)
      resolve(tableList)
    })
  })
}
