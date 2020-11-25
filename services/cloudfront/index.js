import createCloudFrontDistribution from './createCloudFrontDistribution'
import createCloudFrontOriginAccessIdentity from './createCloudFrontOriginAccessIdentity';

const createCloudFront = async () => {
  try {
    createCloudFrontOriginAccessIdentity().then((res) => {
      let { Id } = res.CloudFrontOriginAccessIdentity;
      createCloudFrontDistribution(Id);
    })
  } catch (e){
    console.error(e)
  }
}

createCloudFront()



export default createCloudFront;

