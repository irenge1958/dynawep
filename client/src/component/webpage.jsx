import React from 'react';
import { FaUpload } from 'react-icons/fa';
import './ImportBox.css';
import { useRef,useState,useEffect } from 'react';
import axios from 'axios';
const UploadPage = (modifications) => {
  console.log()
  const [selectedHtml, setSelectedHtml] = useState("");
 const getpa=async()=>{
    const res=await axios.get('http://localhost:5000/check-html')
   if(!res.data.empty){
    setSelectedHtml(res.data.htmlFiles[0])
   }
    
    
  }
 useEffect(()=>{
  
  getpa()
 },[])

  const handleUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      // Preserve folder structure
      formData.append("files", files[i], files[i].webkitRelativePath);
    }
  console.log(formData)
    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Upload success:", res.data);
      getpa()
    } catch (err) {
      console.error("Upload failed", err);
    }
  };
  const applyModifications = (iframe) => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Create a style element for hover rules (added at top level)
    const styleTag = iframeDoc.createElement('style');
    iframeDoc.head.appendChild(styleTag);
    
    modifications.modifications?.forEach(mod => {
      // Common element targeting logic
      let elements = [];
      if (mod.limitFirst) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(0, mod.limitFirst);
      } else if (mod.limitLast) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(-mod.limitLast);
      } else if (mod.nthElement) {
        const allElements = Array.from(iframeDoc.querySelectorAll(mod.selector));
        elements = allElements[mod.nthElement - 1] ? [allElements[mod.nthElement - 1]] : [];
        console.log([allElements[mod.nthElement - 1]])
      } else if (mod.element) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.element));
        console.log(elements)
      }
    
      // Apply base styles
      if (elements.length) {
       
          elements.forEach(el => {
            console.log(mod.style,el)
            el.style.cssText += mod.style;
          });
        }
      
    
      // Add hover styles if they exist (NEW)
      if (mod.hover && elements.length) {
        // Generate unique IDs for scoped hover styles
        elements.forEach((el, index) => {
          const hoverId = `dynawep-hover-${mod.selector.replace(/\W/g, '-')}-${index}`;
          el.dataset.hoverId = hoverId;
          
          styleTag.textContent += `
            [data-hover-id="${hoverId}"]:hover {
              ${mod.hover}
            }
          `;
        });
      }
    
      if (mod.createElement) {
        const newElement = iframeDoc.createElement(mod.createElement.tag || 'div');
        
        // Set attributes (id, class, etc.)
        if (mod.createElement.attributes) {
          Object.entries(mod.createElement.attributes).forEach(([key, value]) => {
            newElement.setAttribute(key, value);
          });
        }
    
        // Apply styles
        if (mod.style) {
          newElement.style.cssText = mod.style;
        }
    
        // Set content (text/html)
        if (mod.createElement.content) {
          newElement.innerHTML = mod.createElement.content;
        }
    
        // Insert into DOM
        const insertTarget = iframeDoc.querySelector(mod.createElement.insertBefore || 'body');
        if (insertTarget) {
          insertTarget.appendChild(newElement);
        }
      }
    
      // ==============================================
      // 4. Your Existing Remove Element Logic (PRESERVED VERBATIM)
      // ==============================================
      if (mod.removeElement) {
        const elementToRemove = iframeDoc.querySelector(mod.selector);
        if (elementToRemove?.parentNode) {
          elementToRemove.parentNode.removeChild(elementToRemove);
        }
      }
      // Remove multiple elements
      else if (mod.removeAllMatching) {
        const elementsToRemove = iframeDoc.querySelectorAll(mod.selector);
        elementsToRemove.forEach(el => el.parentNode?.removeChild(el));
      }
    });
  };

    console.log(modifications.modifications)
    const iframeRef = useRef(null);
    useEffect(() => {
      
      if (iframeRef.current && modifications.modifications.length > 0) {
        applyModifications(iframeRef.current);
      }
    }, [modifications]);
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'auto', backgroundColor: '#121212' }}>
      <div
        style={{
          transform: 'scale(0.80)', // Adjust scale to reduce size (e.g., 0.8 = 80%)
          transformOrigin: 'top left',
          width: '125%', // Compensate for the shrink
          height: '100vh',
          border: 'none',
        }}
      >
         
         {selectedHtml && (<iframe
           ref={iframeRef}
          src={`http://localhost:5000/uploads/${selectedHtml}`}
          title="Editable Website"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          
        ></iframe>)}
         
         {!selectedHtml && <div className="upload-page">
        <div className="upload-container">
          <input type="file" style={{display:'none'}} id="file-cover" accept=".zip"  webkitdirectory="true" directory="" multiple onChange={handleUpload} />
          <label htmlFor="file-cover">
          <FaUpload className="upload-icon" />
          <p className="upload-text">Upload your website here</p>
          <div className="upload-button" >Upload</div>
          </label>
        </div>
      </div>}
     
      </div>
    </div>
  );
};

export default UploadPage;
