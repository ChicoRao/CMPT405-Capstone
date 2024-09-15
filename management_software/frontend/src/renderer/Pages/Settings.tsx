import React from 'react';
import { Switch } from 'antd';
import axios from 'axios';
import '../css/Settings.css';

export default function Settings() {

    function save(){
        document.getElementById('wifiName').value = "";
        document.getElementById('wifiPassword').value = "";
    }

    const GestureQRSwitch = (GestureQR: boolean) => {
        axios.put("http://127.0.0.1:5000/GestureQRSwitch", {isUsingQR: GestureQR});
    }

	return(
        <div className='Settings'>
            <div className='WifiInput'>
                <div>
                    <form>
                        <label>
                            Wifi Name:
                            <input id="wifiName" type="text" name="WifiName" />
                        </label>
                    </form>
                </div>
                <div>
                    <form>
                        <label>
                            Password:
                            <input id="wifiPassword" type="text" name="Password" />
                        </label>
                    </form>
                </div>
                <div className="saveWifiButtonDiv">
                    <button className="saveWifiButton" onClick={save}> Save </button>
                </div>
            </div>
            <div className="GestureQRSwitch">
                <Switch onChange={GestureQRSwitch} checkedChildren="QR Code" unCheckedChildren="Hand Gesture" />
            </div>
        </div>
    );
};