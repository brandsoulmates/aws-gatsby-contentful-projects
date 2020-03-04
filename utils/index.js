const chalk = require('chalk') // make it pretty

export const printError = (e) => {
  let { message, code } = e;
  if (message){
    console.error(chalk.green(`${chalk.yellow(e.message)}, Code: ${chalk.blue(MalformedPolicyDocument)}`))
  } else {
    console.error(e)
  }
}
/**
 * Catch Errors Handler
 * Instead of using try{} catch(e) {} in each controller, we wrap the function in
 * catchErrors(), catch any errors they throw, and pass it along to our express middleware with next().
 */

module.exports.catchErrors = (fn) => {
  return function (request, response, next) {
    return fn(request, response, next).catch((e) => {
      if (e.response) {
        e.status = e.response.status
      }
      next(e)
    })
  }
}
