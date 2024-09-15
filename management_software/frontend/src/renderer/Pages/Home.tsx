import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tabs from '../Component/Tabs';
import Layout from '../Component/Layout';
import Popup from '../Component/Popup';
import ActionList from 'renderer/Component/ActionList';
import PlaceHolder from '../Component/PlaceHolder';


import '../css/Home.css';
import tableLogo from '../../../assets/icons/editor/table.svg';
import chairLogo from '../../../assets/icons/editor/chair.svg';
import cashierLogo from '../../../assets/icons/editor/cashier.png';
import tableLogo1 from '../../../assets/icons/editor/Table1.svg';
import boothTableLogo from '../../../assets/icons/editor/booth_table.png';
import dividerLogo from '../../../assets/icons/editor/divider.png';
import doorLogo from '../../../assets/icons/editor/door.png';
import { Action } from 'history';

interface LayoutDataCell {
  id: string,
  type: string,
  icon: string,
  top: number,
  left: number,
  rotation: string,
}

const symbolsList = [
  {
    name: "Table",
    icon: tableLogo1
  },
  {
    name: "Chair",
    icon: chairLogo
  },
  {
    name: "Booth Table",
    icon: boothTableLogo
  },
  {
    name: "Divider",
    icon: dividerLogo
  },
  {
    name: "Cashier",
    icon: cashierLogo
  },
  {
    name: "Door",
    icon: doorLogo
  }
]

let colourDeg = new Map<string, string>([
  ['red', '(0deg)'],
  ['yellow', '(0deg)'],
  ['blue', '(240deg)'],
  ['green', '(120deg)']
]);

interface Home {
  update: () => void
  tableInfo: Map<string,string>
  tableAction: Map<string,string>
  attention: Boolean
  resetActions: () => void
}

//Layout tabs will soon be replaced with dynamic version
export default function Home({ update, tableInfo, tableAction, attention, resetActions }: Home) {
  const urlLayout = "http://127.0.0.1:5000/GetLayout";
  // const recalibrateURL = "http://127.0.0.1:5000/capture";


  const [GetLayout, setLayout] = useState<LayoutDataCell[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    axios.get(urlLayout)
    .then(data => {
      if (data.data.length)
        setLayout(data.data)
    })
    .catch(err => console.log(err));
  }, []);

  function recalibrate(){
    console.log("Recalibrating")
    axios.put("http://127.0.0.1:5000/capture")
    // fetch('http://127.0.0.1:5000/capture', {
    //   method: 'PUT',
    //   mode: 'cors',
    // })
  }

  const togglePopup = (tableId) => {
    setIsPopupOpen(!isPopupOpen);
    setSelectedTable(tableId);
  }

  const recalibrateSingleTable = () => {
    console.log(selectedTable);
    axios.put("http://127.0.0.1:5000/captureSelectedTable", {tableId: selectedTable});
    togglePopup("");
  }

  const closePopup = () => {
    togglePopup("");
  }

  // function UpdateLayout() {
  //   axios.get(urlLayout)
  //   .then(data => {
  //     setLayout(data.data)
  //   })
  //   .catch(err => console.log(err));
  // }

  return (
    <div style={{display: 'grid', gridTemplateColumns: "repeat(2,1fr)"}}>
    <div className="right-content">
    {/* <img src="/icon.jpg" alt="My_Logo"></img> */}
      <Tabs isEdit={false} />
      <div id="layout">
        <div id="layout-legend-content">
          <div id="layout-legend">
            <ul id="layout-legend-elements">
              <li>
                <span className="legend-colors">
                </span>
                Free
                <div>
                </div>
              </li>
              <li>
                <span className="legend-colors">
                </span>
                Occupied
                <div>
                </div>
              </li>
              <li>
                <span className="legend-colors">
                </span>
                Dirty
              </li>
            </ul>
          </div>
          <div className = "center">
          <div className="layout-editor-content">
          {Array.isArray(GetLayout) && GetLayout.map((data: LayoutDataCell) => {
            console.log(attention);
            if(data.id in tableInfo){
              console.log(tableInfo[data.id])
              let tablecolour = colourDeg.get(tableInfo[data.id])
              const styleTable = {
                filter: 'invert(.5) sepia(1) saturate(100) hue-rotate'+ tablecolour
              }
              console.log(data.top)
              return (
                  <div key={data.id}
                  style={{position: 'absolute', top: data.top + 'px', left: data.left + 'px'}}
                  id={data.id}
                  onClick={(e) => togglePopup(data.id)}
                  >
                  <div 
                    className = "logo"
                  
                  >
                    <h4 className = "TableNumber">Table {data.id}</h4>
                    <img 
                      style = {styleTable}
                      src={data.icon}
                      className={"editor-item cursor " + data.rotation}
                      draggable="false"
                      
                      />
                  </div>
                </div>
              )
            }
            return (
                <div key={data.id}
                  style={{position: 'absolute', top: data.top + 'px', left: data.left + 'px'}}
                  id={data.id}
  
                >
                  <div 
                    className = "logo"
                  >
                    <img 
                      src={data.icon}
                      className={"editor-item cursor " + data.rotation}
                      draggable="false"
                      
                      />
                  </div>
                </div>
            )
          })}
        </div>
        {isPopupOpen && <Popup tableId={selectedTable} buttonAction={recalibrateSingleTable} handleClose={closePopup} />}
          <div class="space"></div>
          {/* <button id="triggerr" onClick={UpdateLayout} class="button">
            Update Layout
          </button> */}
          <div class="space">
           </div>
          <button
            id="trigger" 
            onClick={update} class="button">
            Connect
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            id="trigger" 
            onClick={recalibrate} class="button">
            Recalibrate All
          </button>
        </div>
        
        </div>
      </div>
    
    </div>
    <div className='left-content'>
      <div className='ActionList'>
            <ul className='List'>
              {tableAction? <ActionList tableAction = {tableAction}/>: <PlaceHolder/>}
            </ul>
      </div>
    </div>
    </div>
  );
};