import s3 from './services/s3';
import cF from './services/cloudfront';
import iam from './services/iam';
import cb from './services/codebuild';

// create s3 bucket
// create cF
// create iam policies
// create and start the codebuild
const deploy = async () => {
  try {
    s3.then(() => {
      cF().then(() => {
        // then update bucket policy s3.updateBucketPolicy
        iam().then(() => {
          cb()
        })
      })
    })
  } catch (e){
    console.error(e)
  }
}

deploy()