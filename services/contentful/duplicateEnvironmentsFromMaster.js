import contentful from 'contentful-management';
const {
  environments,
  cms: {
    contentful: {
      managementAccessTokenSecret,
      deliveryAccessToken,
      previewAccessToken,
      spaceId,
      environment,
      host,
      previewMode
    }

  }
} = config;

// create service object
const c = contentful.createClient({
  accessToken: managementAccessTokenSecret
})


const createEnvironment = async (spaceId, envId) => {
  c.getSpace(spaceId)
  .then((space) => space.createEnvironmentWithId(envId, { name: envId}, 'master'))
  .then((environment) => console.log(environment))
  .catch(console.error)
}

const createEnvironments = async (spaceId) => {
  for (let i = 0; i < environments.length; i++){
    let environment = environments[i]
    createEnvironment(spaceId, environment);
  }
}

export default createEnvironments