const inquirer = require('inquirer')
inquirer
  .prompt([
    {
      type: 'input',
      default: false,
      name: 'go',
      message: 'Is everything ready for publication?',
    },
  ])
  .then((answers) => {
    if (answers.go === 'true') {
      console.log('🚀')
    } else {
      console.log('💥')
      process.exit(1)
    }
  })
