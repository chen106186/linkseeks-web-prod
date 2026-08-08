import { exec } from "child_process";

export const runCmd = (cmd: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        reject(err);
      }
      resolve(stdout || stderr);
    });
  });
};
