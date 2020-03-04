// TODO

import createSpace from "./createSpace"
import duplicateEnvironmentsFromMaster from "./duplicateEnvironmentsFromMaster";

const setupContentful = async () => {
  createSpace()
  createAndSaveKeys()
  seedMasterEnvironment()
  .then((space) => {
    let spaceId = space.sys.id;
    // upload seeding information to 
    duplicateEnvironmentsFromMaster(spaceId)
  })
}