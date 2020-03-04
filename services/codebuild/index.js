import createProject from './createProject';
import startBuild from './startBuild';

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
