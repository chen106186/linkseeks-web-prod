import chalk from "chalk";

class Log {
  success(message) {
    console.log(chalk.green(message));
  }

  error(message) {
    console.log(chalk.red(message));
  }

  default(message) {
    console.log(message);
  }
}

export default new Log();
