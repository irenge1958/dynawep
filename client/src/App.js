import './App.css';
import Navbar from './component/topbar'
import UploadPage from './component/webpage'
import Widget from './component/Widget'
import { useState,useEffect } from 'react';
function App() {
  const [modifications, setModifications] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
    <div className="App">
      <div>
        <Navbar  setLoading={setLoading} setModifications={setModifications}/>
        <div style={{display:'flex',width:'100%',height:'100%'}}>
        <UploadPage modifications={modifications} loading={loading} setLoading={setLoading} setModifications={setModifications}/> 
        <Widget modifications={modifications} setModifications={setModifications}/>
        </div>
      </div>
    </div>
  );
}

export default App;
