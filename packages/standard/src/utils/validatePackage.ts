import { runCmd } from "./cmd";
const chalk = require("chalk");

export const validatePackage = (packageName: string) => {
  return new Promise((resolve) => {
    try {
      require(packageName);
      resolve(true);
    } catch (err) {
      resolve(false);
    }
  });
};

export const checkPackageWithInstall = (
  packageName: string,
  flag: string = "dev"
) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const pkgResult = await validatePackage(packageName);

      const flagType = {
        dev: "-D",
        prod: "-S",
        global: "-g",
      };
      if (!pkgResult) {
        console.error(chalk.green(`${packageName} not exist, will install it`));
        const output = await runCmd(
          `npm install ${packageName} ${flagType[flag]}`
        );
        resolve(output);
      } else {
        resolve(`is install ${packageName}`);
      }
    } catch (error) {
      reject(error);
    }
  });
};
