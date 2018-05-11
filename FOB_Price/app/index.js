
import 'babel-polyfill'
require('whatwg-fetch');
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import UploadFOB from './UploadFOB'


import './debug'

function mountComponent(element, id) {
  if(document.getElementById(id)){
    ReactDOM.render(element, document.getElementById(id));
  }
}

function customizationFobList() {
  const webUrl = _spPageContextInfo.webServerRelativeUrl;
  const digest = document.getElementById('__REQUESTDIGEST').value;
  mountComponent(<UploadFOB webUrl={webUrl} digest={digest}/>,'upload-foblist');
}

customizationFobList();
