import { exec } from 'child_process'

import path from 'path'

const extensionPathResolve = (url: string) => {
  return path.join(__dirname, '../../../extension', url)
}
const extensionList = [{ path: extensionPathResolve('create-template/create-template-0.0.1.vsix') }]

const getInstallExtensionCode = (vsixPath: string) => {
  return new Promise((resolve, reject) => {
    exec(`code --install-extension ${vsixPath}`, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      stdout && console.log(stdout)
      stderr && console.error(stderr)
      resolve(stdout)
    })
  })
}

const preInstallWork = () => {
  return new Promise(async (resolve, reject) => {
    const result = await Promise.all(extensionList.map(async (v) => await getInstallExtensionCode(v.path)))
    resolve(result)
  })
}

const main = async () => {
  try {
    await preInstallWork()
  } catch (err) {
    console.log(err)
  }
}

main()
