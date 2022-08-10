import React from 'react'


const Header = () => {


  return (
    <React.Fragment>
      <div className="header mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-12 mt-2">
              <div className="logo mt-2">
                <div className="copy">
                  <p style={{color: "#FFF"}}>タスク管理ツール</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default  Header;
