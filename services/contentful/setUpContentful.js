import fs from 'fs';
import {
  initContentfulClients,
  getSpace,
} from './initClient'
import duplicateEnvironmentsFromMaster from "./duplicateEnvironmentsFromMaster";
import addExtensionsAndUpdateSidebars from './updateSidebars';

const contentTypes = ['article','event','news','office','page','practiceArea','professional']

const setupContentful = async () => {
  initContentfulClients()
  const space = await getSpace('cma')
  //TODO
  // create Extensions
  // create Sidebar w/ custom extensions

  let extensionIds = [
    {
      sys: {
        id: ''
      }
    },
    {
      sys: {
        id: ''
      }
    },
  ]
  addExtensionsAndUpdateSidebars(space, contentTypes, extensionIds);
  // duplicateEnvironmentsFromMaster(space)


  // TODO
  // aliasMaster();
}

export default setupContentful