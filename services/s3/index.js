import createBucket from './createBucket';
import updateWebsitePolicy from './updateWebsitePolicy';

const createS3 = async () => {
  try {
    createBucket().then((data) => {
      updateWebsitePolicy()
    })
  } catch (e){
    console.error(e)
  }
}

export default createS3