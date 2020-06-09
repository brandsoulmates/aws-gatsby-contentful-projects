import createProject from './createProject';
import startBuild from './startBuild';

// update env variable GATSBY_AWS_CLOUDFRONT_DISTRIBUTION
const createCodeBuild = async () => {
  try {
    createProject().then((data) => {
      startBuild()
    })
  } catch (e){
    console.error(e)
  }
}

export default createCodeBuild
