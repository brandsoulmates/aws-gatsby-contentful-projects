import config from '../../config';

const {
  environments
} = config;


const createEnvironment = async (space, envId) => {
    try {
      let res = await space.createEnvironmentWithId(envId, { name: envId}, 'master')
      return res;
  }
    catch(e){
      console.error(e)
    }

}

const createEnvironments = async (space) => {
  const allEnvs = await Promise.all(
    environments.map(env => createEnvironment(space, env))
  )
  return allEnvs;
}

export default createEnvironments