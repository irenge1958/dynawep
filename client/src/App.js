import './App.css';
import Navbar from './component/topbar'
import UploadPage from './component/webpage'
import Widget from './component/Widget'
import { useState,useEffect } from 'react';
function App() {
  const [modifications, setModifications] = useState([]);
 
  return (
    <div className="App">
      <div>
        <Navbar setModifications={setModifications}/>
        <div style={{display:'flex',width:'100%',height:'100vh'}}>
        <UploadPage modifications={modifications} setModifications={setModifications}/> 
        <Widget modifications={modifications} setModifications={setModifications}/>
        </div>
      </div>
    </div>
  );
}

export default App;
