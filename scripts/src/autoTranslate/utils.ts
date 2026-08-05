import fs from 'fs'
import path from 'path'
export const writeFile = (fileName: string, data: any) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, fileName), JSON.stringify(data), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

export const writeDirFile = (dirs) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirs, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      const tempPath = files.map((v) => path.resolve(dirs, v))
    })
  })
}
