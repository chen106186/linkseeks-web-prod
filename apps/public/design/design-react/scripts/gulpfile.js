const gulp = require('gulp')
const chalk = require('chalk')
const runCmd = require('./runCmd')

const localRegistry = 'http://10.0.0.21:8081/repository/node-local/'

gulp.task(
  'patch',
  gulp.series((done) => {
    dist('patch', done)
  }),
)

function dist(tagString, done) {
  runCmd('npm', ['run', 'build'], (code) => {
    if (code) {
      done(code)
      return
    }
    publish(tagString, done)
  })
}
function publish(tagString, done) {
  if (tagString === 'patch') patchPublish(done)
}

function patchPublish(done) {
  runCmd('npm', ['version', 'patch'], () => {
    console.log(chalk.green(`版本号已更新`))
    pub(done)
  })
}

function pub(done) {
  runCmd('npm', ['publish', '--registry', localRegistry], (code) => {
    if (code) {
      done(code)
      return
    }

    console.log(chalk.green('发布成功'))
  })
}
