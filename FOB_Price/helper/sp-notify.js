import reactToHtml from './reactToHtml'
import React from 'react'

export function addSPNotify(element, isSticky){
  const handle = SP.UI.Notify.addNotification(reactToHtml(element), isSticky);
  // var obj = SP.UI.Notify.showLoadingNotification(true);
}

export function addSPErrorNotify(message, isSticky=false){
  addSPNotify(<div style={{height: 30, lineHeight: '30px',color: 'red'}}>{message}</div>, isSticky);
}

export function addSPWarningNotify(message, isSticky=false){
  addSPNotify(<div style={{height: 30, lineHeight: '30px',color: '#b59b15'}}>{message}</div>, isSticky);
}

export function addSPSuccessNotify(message, isSticky=false){
  addSPNotify(<div style={{height: 30, lineHeight: '30px',color: 'green'}}>{message}</div>, isSticky);
}

export function addSPInfoNotify(message, isSticky=false){
  addSPNotify(<div style={{height: 30, lineHeight: '30px',color: '#b59b15'}}>{message}</div>, isSticky);
}
