import contentful from 'contentful-management';
import { updateEnvVariable } from '../filesystem'
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

const createApiKeys = async () => {
  client.getSpace('<space_id>')
  .then((space) => space.getApiKeys())
  .then((response) => console.log(response.items))
  .catch(console.error)
}

const createAndSaveKeys = () => {
  let keys = createApiKeys()

  for (let i = 0; i < keys.length; i++){
    updateEnvVariable({variableKey: i, variableValue: keys[i]})
  }

}

export default createAndSaveKeys()