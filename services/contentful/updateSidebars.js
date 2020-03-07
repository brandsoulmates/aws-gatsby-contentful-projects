import config from '../../config';

const {
  environments
} = config;

// endpoint not currently supported by sdk
const addExtensionToEnvironment = async (space, extensionFile) => {
  try {

  } catch (e) {
    console.error(e)
  }
}

const updateSidebars = async (space, contentTypes, extensions) => {  
  let extensionsWidget = extensions.map(extension => ({
    settings: {},
    widgetId: extension.sys.id,
    widgetNamespace: 'extension'
  }));

  try {
      for (contentType of contentTypes) {
          editorInterface = await space.environment.getEditorInterfaceForContentType(contentType);
          editorInterface.sidebar = [ ...extensionsWidget, ...editorInterface.sidebar]
          editorInterface.update()
      }
  } catch (error) {
      console.error(error);
  }

}

const updateSidebarsAndAddExtensions = async (space, contentTypes, extensions) => {
  updateSidebars(space, contentTypes, extensions);
}

export default updateSidebarsAndAddExtensions
