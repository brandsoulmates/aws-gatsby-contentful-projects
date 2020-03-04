const chalk = require('chalk') // make it pretty

export const printError = (e) => {
  let { message, code } = e;
  if (message){
    console.error(chalk.green(`${chalk.yellow(e.message)}, Code: ${chalk.blue(MalformedPolicyDocument)}`))
  } else {
    console.error(e)
  }
}