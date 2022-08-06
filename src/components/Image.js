import React, { useState } from 'react'
import config from "../config/const";
import axios from 'axios'
import ImageList from './ImageList'
const Image = ({callback}) => {
  console.log("start renderging");
  const apiEndPoint = config.development.host + "/api/image/upload";
  const selectFile = (e) => {
    const formObject = document.querySelector("#upload_file")
    const files = formObject.files;
    Object.keys(files).forEach((value) => {
      let f = new FormData();
      console.log(files[value])
      f.append("upload_file", files[value])
      axios.post(apiEndPoint, f).then((result) => {
        console.log(result);
        if (result.data.status) {
          console.log(result.data);
          callback(result.data.response.image.id);
        }
      }).catch((error) => {
        console.log(error);
      })
    })
  }
  return (
    <React.Fragment>
      <div className="file-uploader-unit">
        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <p>添付ファイルを付与</p>
          <p><input type="file" onChange={selectFile} className="form-control" name="upload_file" id="upload_file" value="" /></p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Image;
