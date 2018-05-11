import React, { PropTypes } from 'react'
import {OpenUploadFileDialog} from '../helper/sp-dialog'
import {getListItems, deleteListItems} from '../helper/sp-rest-api'
import {addFOB, readFOBExcel, cleanupExcelRows} from './FOBService'
import reactToHtml from '../helper/reactToHtml'
import {addSPWarningNotify, addSPErrorNotify, addSPInfoNotify, addSPSuccessNotify} from '../helper/sp-notify'

class UploadFOB extends React.Component {
  constructor(props){
    super(props)
    this.state= {importExcelState: '', message: '', progressMessage: ''};
    this.onUploadClick = this.onUploadClick.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  render () {
    const self = this;
    const {message, progressMessage} = this.state;
    return <div style={{display: 'inline-block'}}>
    <input type="text" style={{width: 280}} placeholder="Choose an excel file" value={this.importExcelState} onChange={evt => self.setState({importExcelState: evt.target.value})}/>
    <input type="button" disabled={progressMessage} onClick={this.onUploadClick} value={'Upload Excel ' + (progressMessage ? progressMessage : '')}/>
    <span>{message}</span>
    </div>;
  }

  async onUploadClick(){
    const {webUrl, digest} = this.props;
    const {importExcelState} = this.state;
    const onProgress = progressMessage => this.setState({progressMessage});
    this.handleUpload(importExcelState);
  }

    handleUpload(importExcelState){
    const onProgress = progressMessage => this.setState({progressMessage});
    const {webUrl, digest} = this.props;
    const self = this;

    onProgress('Uploading excel file...');
    addSPInfoNotify('Uploading excel file...');

    OpenUploadFileDialog({
      webUrl: webUrl,
      libraryID: 'B1CFE9CD-0AD2-44BF-BE83-22092CE1EE78',
      onUploaded: fileUrl => {
        //we only need libraryName/filename
        const fileComponents = fileUrl.split('/');
        const fileName = fileComponents[fileComponents.length-1];
        self.addFOBFromExcelFile(fileName);
      }
    });
  }

  async addFOBFromExcelFile(fileName){
    const {webUrl, digest} = this.props;
    const {importExcelState} = this.state;
    const onProgress = progressMessage => this.setState({progressMessage});
    const self = this;

    try{
        const rows = await readFOBExcel({webUrl, fileUrl: '/Temp FobList Doc/'+fileName, range: 'A1|D1000'});
        await addFOB({webUrl, rows, digest, onProgress, importExcelState});

      onProgress('');
      addSPSuccessNotify(`${rows.length} items are processed`);
      setTimeout(_ => location.href = location.href, 2000);
    }
    catch(err){
      onProgress('');
      addSPErrorNotify('Error: ' + err.toString(), true);
    }
  }
}

export default UploadFOB;
