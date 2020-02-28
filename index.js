// import s3 from './services/s3';
import cF from './services/cF';

const deploy = async () => {
  try {
    cF()
  } catch (e){
    console.error(e)
  }
}

deploy()