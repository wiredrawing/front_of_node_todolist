import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config/const'

/**
 * @param isUpdated
 * @param callback クリックした画像の画像IDを返却するコールバック
 * @returns {JSX.Element}
 * @constructor
 */
const ImageList = ({ isUpdated, callback }) => {
  console.log("Image component start rendering");
  const [ images, setImages ] = useState([]);
  const apiEndPoint = config.development.host + "/api/image/image";
  const apiToShowImage = config.development.host + "/api/image/show";
  // 初回レンダリング時のみ評価
  useEffect(() => {
    axios.get(apiEndPoint).then((result) => {
      console.log(result);
      setImages(result.data.response.images);
    })
  }, [ isUpdated ])

  const imagesBox = {
    display: "flex",
    flexWrap: "wrap"
  }
  const imageUnitBox = {
    width: "15%",
    margin: "1%",
  }
  // 画像クリック時の挙動
  const clickImage = (imageId) => {
    const callbackImageId = (imageId) => {
      return (e) => {
        alert(imageId);
        // 親コンポーネントにクリックした画像IDを返却する
        if (callback) {
          callback(imageId)
        }
      }
    }
    return callbackImageId(imageId)
  }
  return (
    <React.Fragment>
      <div id="images-box" style={imagesBox}>
        {images.map((value, index) => {
          return (
            <div className="image-unit-box" style={imageUnitBox} key={value.id}>
              <p><img onClick={clickImage(value.id)} alt={value.id} width="100%" src={apiToShowImage + "/" + value.id}/></p>
              <p>{value.id}</p>
            </div>
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default ImageList;
