import createBucket from './createBucket';
import updateWebsitePolicy from './updateWebsitePolicy';

// to do
// update bucket policy 
// after cloudfront is created
// after codebuild is greated
const createS3 = async () => {
  try {
    createBucket().then((data) => {
      updateWebsitePolicy()
    })
  } catch (e){
    console.error(e)
  }
}
createS3()

export default createS3