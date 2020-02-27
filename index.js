import s3 from './services/s3';

const deploy = async () => {
  try {
    s3()
  } catch (e){
    console.error(e)
  }
}

deploy()