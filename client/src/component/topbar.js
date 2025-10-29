import React from 'react';
import './Navbar.css';
import axios from 'axios';
import { useRef } from 'react';

const Navbar = ({setModifications}) => {
  const mod=useRef();
  const fetchModifications = async () => {

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
  setModifications(response.data.operations);
}catch (err) {
  console.error('Failed to fetch modifications', err);
}
  };
  return (
    <nav className="navbar">
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
