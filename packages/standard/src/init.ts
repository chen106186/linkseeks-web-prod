/**
 * 初始化项目的配置
 * @todo 初始化Commitizen的安装
 */

import { checkPackageWithInstall } from "./utils/validatePackage";
import { FileUtils } from "./utils/fs";
import path from "path";
import log from "./utils/log";
import { runCmd } from "./utils/cmd";

const file = new FileUtils();
const cwd = process.cwd();

const resolvePath = (p: string) => path.resolve(__dirname, p);

/**
 * 更新配置文件
 */
const updatePkgConfigRc = async (
  packageName: string,
  isCopy: boolean = false
) => {
  const readData: any = isCopy
    ? resolvePath(`./tpl/${packageName}`)
    : await file.getFile(resolvePath(`./tpl/${packageName}`));

  return isCopy
    ? await file.copyFile(readData, path.resolve(cwd, packageName))
    : await file.insertFile(path.resolve(cwd, packageName), readData);
};

const initHusky = async () => {
  if (await file.isExist(path.resolve(cwd, ".husky"))) {
    return false;
  }
  log.default(await runCmd("npx husky install"));
  log.default(await runCmd('npm pkg set scripts.prepare="husky install"'));
  log.default(
    await runCmd(
      'npx husky add .husky/pre-commit "node_modules/.bin/lint-staged"'
    )
  );
  log.default(
    await runCmd(
      'npx husky add .husky/commit-msg "node_modules/.bin/commitlint -e $HUSKY_GIT_PARAMS"'
    )
  );
  return;
};
(async function run() {
  log.default("安装依赖中...\n");
  /**
   * 检测是否安装相关依赖包
   * 若未安装则自动下载
   */
  await checkPackageWithInstall("commitizen", "dev");
  await checkPackageWithInstall("commitlint", "dev");
  await checkPackageWithInstall("lint-staged", "dev");
  await checkPackageWithInstall("husky", "dev");

  log.success("安装依赖结束！\n");

  log.default("初始化配置文件中\n");
  // 初始化配置文件
  updatePkgConfigRc(".lintstagedrc.json");
  updatePkgConfigRc(".commitlintrc.json");
  updatePkgConfigRc(".cz.json");
  updatePkgConfigRc(".eslintrc.js", true);
  updatePkgConfigRc(".prettierrc.js", true);
  updatePkgConfigRc(".eslintignore", true);
  updatePkgConfigRc(".prettierignore", true);

  log.success("初始化配置文件结束!\n");

  // 初始化配置命令
  initHusky();

  log.default("----------------------------------------------");
  log.default("\n");
  log.default("\n");
  log.success(`
    \n
    恭喜现在你已经初始化整个项目规则了，后续请通过\n
    git add . \n
    git cz \n
    提交代码！\n
  `);
})();
