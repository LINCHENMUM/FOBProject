import {addListItem,updateListItem} from '../helper/sp-rest-api'

export function readFOBExcel({webUrl, fileUrl, range}) {
  const excelApiUrl = `${webUrl}/_vti_bin/ExcelRest.aspx${fileUrl}/model/Ranges('Sheet1!${range}')?$format=json`;
  return fetch(excelApiUrl, {credentials: 'same-origin'}).then(res => res.json()).then(res => res.rows).then(rows => filterEmptyRows(rows));
}

function filterEmptyRows(rows){
  var index = 0;
  for (; index < rows.length; index++) {
    let row = rows[index];
    if(row.every(cell => !cell.v))
      break;
  }
  return rows.slice(1, index); // skip header row
}

export function addFOB({webUrl, rows, digest, importExcelState, onProgress}) {
    const items = rows.map(row => convertExcelRowToListItem(row, importExcelState));
    const length = items.length;
    let addedCount = 0;
    let updatedCount=0;
    let unnormalCount=0;
    let result = Promise.resolve();
    let unnormalPartNoArray=[];
    var j;
    
    passCheckingCategory();

    async function passCheckingCategory(){
        for(j=0;j<items.length;j++){
      
            const bubdId=items[j].BUBDId;
            const profitCenterId=items[j].ProfitCenterNId;
            const categoryId=items[j].CategoryNId;
            const familyId=items[j].FamilyNId;
            const partNoUnnormal=items[j].Title;
           
            const unnormalItem=await getCategoryID(webUrl,bubdId,profitCenterId,categoryId,familyId);
            if (unnormalItem===null){
                unnormalPartNoArray.push(partNoUnnormal);
                unnormalCount+=1;
            }
        }
        if (unnormalCount>0){
            alert("Illegal family code: "+unnormalPartNoArray.join('*'));
            return null;
        }else{
            addAndUpdateFOBList();
        }
    }

    async function addAndUpdateFOBList(){
        
        for(i=0;i<items.length;i++){
          
            let parno=items[i].Title;
            const idresult= await getItemId(webUrl,parno);
            const item=items[i];
            
            if(idresult === null){
                    result.then(_ => addListItem({
                    webUrl: webUrl,
                    listTitle: 'FOB Price',
                    data: item,
                    metadataType: 'SP.Data.FOB_x005f_PriceListItem',
                    digest,
                })).then(addResult => onProgress(`${++addedCount}/${length} added...`))
           }else{
                result.then(_ => updateListItem({
                    webUrl: webUrl,
                    listTitle: 'FOB Price',
                    data: item,
                    metadataType: 'SP.Data.FOB_x005f_PriceListItem',
                    listItemId:idresult,
                    digest,
                })).then(updateResult => onProgress(`${++updatedCount}/${length} updated...`));
            }
    }
}         
  return result;
}

  function convertExcelRowToListItem(row, importExcelState) {
  const excelColumnListItemFieldMapping = [
    "Title",
    "BUBDId",
    "ProfitCenterNId",
    "CategoryNId",
    "FamilyNId",
    "OData__x0032_017price",
    "description",
  ];

  const sdf = ()=>{};

  const itemData = {};
  var cellValue;
  var rowCombineValue;

  for (var i = 0; i < row.length; i++) {
      cellValue = row[i].v;
      if(i===0){
          rowCombineValue=cellValue.split("_");
          for (var j=4;j<rowCombineValue.length;j++){  
              itemData[excelColumnListItemFieldMapping[j-3]] = rowCombineValue[j];
          } 
      }else if (i===1){
          itemData[excelColumnListItemFieldMapping[i-1]]=cellValue;
      }else if (i===2 || i===3){
          itemData[excelColumnListItemFieldMapping[i+3]]=cellValue;
      }    
  }

  return itemData;
}

async function getItemId(webUrl,partno){
    const url =webUrl+`/_api/web/lists/getbytitle('FOB Price')/items?$select=ID&$filter=Title eq '${partno}'`;
    const results =await  fetch(url, {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose'
        }
    }).then(res => res.json())
    .then(json => json.d.results);

    if(results.length === 0){
        return null;
    }
    return results[0].ID;
}

async function getCategoryID(webUrl,bubdId,profitCenterId,categoryId,familyId){
    const url =webUrl+`/_api/web/lists/getbytitle('New Category')/items?$select=ID&$filter=BUBD/Id eq ${bubdId} and ProfitCenter/Id eq ${profitCenterId} and CategoryN/Id eq ${categoryId} and Series_x0020__x0028_Family_x00290/Id eq ${familyId}`;
    const results =await  fetch(url, {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose'
        }
    }).then(res => res.json())
    .then(json => json.d.results);

    if(results.length === 0){
        return null;
    }
    return results[0].ID;
}