import fs from 'fs';
import envfile from 'envfile';
import path from 'path';

export const updateEnvVariable = ({variableKey, variableValue}) => {
  const sourcePath = path.resolve(__dirname, '../../.env');
  let parsedFile = envfile.parseFileSync(sourcePath);
  
  parsedFile[variableKey] = variableValue
  fs.writeFileSync('./.env', envfile.stringifySync(parsedFile)) 
  console.log(envfile.stringifySync(parsedFile))
}

