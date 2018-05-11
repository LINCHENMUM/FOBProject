export function OpenUploadFileDialog({webUrl, libraryID, onUploaded, onCancel}) {
    var options = {
        title: "Upload Excel",
        width: 500,
        height: 250,
        url: webUrl + '/_layouts/15/Upload.aspx?List=%7B' +  decodeURIComponent(libraryID) + '%7D&IsDlg=1"',
        //dialogReturnValueCallback: RefreshOnDialogClose
        dialogReturnValueCallback: function (dialogResult, fileInfo) {
          if(dialogResult === 1){
            onUploaded(fileInfo.newFileUrl);
          }else{
            //SP.UI.ModalDialog.RefreshPage(dialogResult);
            onCancel && onCancel();
          }
        }
    };
    SP.UI.ModalDialog.showModalDialog(options);
}

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
