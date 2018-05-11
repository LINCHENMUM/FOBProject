export function addListItem({webUrl, listTitle, data, metadataType, digest}){
  const body = {__metadata: {type: metadataType}, ...data};
  const url = webUrl + `/_api/web/lists/GetByTitle('${listTitle}')/items`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'Content-Type': 'application/json;odata=verbose'
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  }).then(res => res.json());
}

export function updateListItem({webUrl, listTitle, data, metadataType, listItemId, digest}){
    const url = webUrl + `/_api/web/lists/GetByTitle('${listTitle}')/GetItemById(${listItemId})`;
    const body = {__metadata: {type: metadataType}, ...data};

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json;odata=verbose',
            'X-RequestDigest': digest,
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': "*",
            'Content-Type': 'application/json;odata=verbose',
        },
        credentials: 'same-origin',
        body: JSON.stringify(body),
    }).then(res => res.json());
}

export function getListItem({webUrl, listTitle, itemId, params}){
  const url = webUrl + `/_api/web/lists/GetByTitle('${listTitle}')/items(${itemId})` + (params ? '?' + params : '');
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose'
    },
    credentials: 'same-origin',
  }).then(res => res.json());
}

export function getListItems({webUrl, listTitle, params}){
  const url = webUrl + `/_api/web/lists/GetByTitle('${listTitle}')/items` + (params ? '?' + params : '');
  // const digest = DEBUG ? 'fake-digest' : document.getElementById('__REQUESTDIGEST').value;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json;odata=verbose',
      // 'X-RequestDigest': digest,
      'Content-Type': 'application/json;odata=verbose'
    },
    credentials: 'same-origin',
  }).then(res => res.json());
}

export function deleteListItem({webUrl, listTitle, itemId, digest}){
  const url = webUrl + `/_api/web/lists/GetByTitle('${listTitle}')/items(${itemId})`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE',
      'Content-Type': 'application/json;odata=verbose'
    },
    credentials: 'same-origin',
  }).then(res => itemId);
}

export function deleteListItems({webUrl, listTitle, ids, digest, onProgress}){
  const deletePromiseFactories = ids.map(id => _ => {
    return deleteListItem({
      webUrl, listTitle, itemId: id, digest
    })
  });

  return executePromiseSerial(deletePromiseFactories, onProgress);
}

// Execute a list of Promise factory functions in series
function executePromiseSerial(promiseFactories, onProgress) {
  if(!onProgress) onProgress = _ => null;

  var p = Promise.resolve();
  return promiseFactories.reduce(function(prevPromise, curPromise) {
    return prevPromise.then(prevResult => {onProgress(prevResult); curPromise()});
  }, p);
}

export function checkPromiseConditionAtInterval(promiseFactory, interval){
  const promise = new Promise((resolve) => {
    function checkerImplementation(){
      promiseFactory().then(res => {
        if(res) resolve();
        else setTimeout(checkerImplementation, interval);
      });
    }
    checkerImplementation();
  });

  return promise;
}

