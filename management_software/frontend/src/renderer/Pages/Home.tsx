import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tabs from '../Component/Tabs';
import Layout from '../Component/Layout';
import '../css/Home.css';

interface Home {
  update: () => void
  layoutInfo: string
}

//Layout tabs will soon be replaced with dynamic version
export default function Home({ update, layoutInfo }: Home) {
  // const [colour, updateColour] = useState(layoutInfo);
  const url = "http://127.0.0.1:5000/message";

  function testFn() {
    axios.get(url)
    .then(data => console.log(data))
    .catch(err => console.log(err));
  }

  return (
    <div className="right-content">
      <Tabs isEdit={false} />
      <div id="layout">
        <div id="layout-legend-content">
          <button id="triggerr" onClick={testFn}>
            WATER REFILL TEST
          </button>
          <button 
            id="trigger" 
            onClick={update}>
            Update
          </button>
          <div id="layout-legend">
            <ul id="layout-legend-elements">
              <li>
                <span className="legend-colors">
                </span>
                Free
              </li>
              <li>
                <span className="legend-colors">
                </span>
                Occupied
              </li>
              <li>
                <span className="legend-colors">
                </span>
                Need Cleaning
              </li>
              <li>
                <span className="legend-colors">
                </span>
                Attention
              </li>
            </ul>
          </div>
        </div>
        <div id="layout-content">
          <Layout colour={layoutInfo} />
        </div>
      </div>
    </div>
  );
};