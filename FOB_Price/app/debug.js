export const DEV_MODE = location.hostname === 'localhost' ? true: false;

if(DEV_MODE){
  window._spPageContextInfo = {
    webServerRelativeUrl: '/',
    pageListId: 'xxx',
    pageItemId: 5,
  }
}
