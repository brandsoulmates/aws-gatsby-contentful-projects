import contentful from 'contentful-management';
const {
  cms: {
    contentful: {
      managementAccessTokenSecret,
    },
    clientName

  }
} = config;

// create service object
const c = contentful.createClient({
  accessToken: managementAccessTokenSecret
})


const createSpace = async () => {
  try {
    let res = await c.createSpace({
      name: clientName
    })
    return res
  } catch (e){
    console.error(e)
  }
}


export default createSpace