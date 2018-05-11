import ReactDOMServer from 'react-dom/server'
import React from 'react'

export default function reactToHtml(element){
  return ReactDOMServer.renderToString(element);
}
