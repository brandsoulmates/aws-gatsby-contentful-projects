import {
  initContentfulClients,
  getSpace,
} from './initClient'
import duplicateEnvironmentsFromMaster from "./duplicateEnvironmentsFromMaster";

const setupContentful = async () => {
  initContentfulClients()
  const space = await getSpace('cma')
  //TODO
  // create Extensions
  // create Sidebar w/ custom extensions

  duplicateEnvironmentsFromMaster(space).then((res) => {
    console.log("res", res)
  })

  // TODO
  // aliasMaster();
}

setupContentful()

export default setupContentful()