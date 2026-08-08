import fs from "fs";
import path from "path";
import lodash from "lodash";

export class FileUtils {
  /**
   * 若传入的target是json/js 可被require解析的对象，则会通过lodash进行合并写入
   * 若传入的target是不可被解析的，则会被直接覆盖
   */
  insertFile(target: string, data: any) {
    return new Promise(async (resolve, reject) => {
      if (await this.isExist(target)) {
        // 文件已经存在
        try {
          const fileData = await this.readFile(target);
          if (typeof fileData === "object") {
            await this.writeFile(target, lodash.merge(fileData, data));
          } else {
            await this.writeFile(target, data);
          }
        } catch (err) {
          reject(err);
        }
      } else {
        await this.writeFile(target, data);
      }
      resolve(target);
    });
  }

  isExist(target: string) {
    return new Promise((resolve) => {
      resolve(fs.existsSync(target));
    });
  }

  getFile(target: string) {
    const fileType = this.getFileType(target);
    return new Promise(async (resolve, reject) => {
      try {
        if (fileType === "json" || fileType === "js") {
          resolve(require(target));
        } else {
          resolve(await this.readFile(target));
        }
      } catch (err) {
        if (err) {
          reject(err);
        } else {
          resolve(await this.readFile(target));
        }
      }
    });
  }

  getFileType(target: string) {
    const result = path.extname(target);

    return result ? result.replace(".", "") : result;
  }

  copyFile(origin: string, target: string) {
    return new Promise((resolve, reject) => {
      fs.copyFile(origin, target, function (err) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  writeFile(target: string, params: any) {
    let data = "";
    try {
      data = JSON.stringify(params);
    } catch (err) {}
    return new Promise((resolve, reject) => {
      fs.writeFile(target, data, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(target);
        }
      });
    });
  }

  readFile(target: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(target, "utf-8", function (err, params) {
        if (err) reject(err);
        let data = "";
        try {
          data = JSON.parse(params);
        } catch (_) {}
        resolve(data);
      });
    });
  }
}
