import createCloudFrontDistribution from './createCloudFrontDistribution'

const createCloudFront = async () => {

  try {
    createCloudFrontDistribution();
  } catch (e){
    console.error(e)
  }
}

export default createCloudFront;

