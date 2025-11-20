import React from 'react';
import './Navbar.css';
import axios from 'axios';
import { useRef } from 'react';

const Navbar = ({setModifications,setLoading}) => {
  const mod=useRef();
  const fetchModifications = async () => {
    setLoading(true)
//     const parsedValue = JSON.parse(mod.current.value);
//     try {
//       const res = await axios.post('http://localhost:5000/modifications',{json1:parsedValue});
//  // Adjust this endpoint
// console.log(res.data)
//       setModifications(res.data);
//     } catch (err) {
//       console.error('Failed to fetch modifications', err);
//     }
try {
  console.log(mod.current.value)
  const response = await axios.post('http://localhost:5000/nlp/process-command', {
    
    command: mod.current.value.trim()
  });
  console.log(mod.current.value)
  console.log(response)
  console.log(response.data)
  console.log(response.data.operations)
  setModifications((prev) => [...prev,response.data.operations[0]]);
}catch (err) {
  console.error('Failed to fetch modifications', err);
}finally{
  setLoading(false)
}
  };
  return (
    <nav className="navbar" style={{backgroundColor: '#121212'}}>
      <div className="navbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="Edit here..."
          ref={mod}
        />
        <button className="send-button" onClick={fetchModifications}>Send</button>
      </div>
    </nav>
  );
};

export default Navbar;
