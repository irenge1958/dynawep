// web
import React from 'react';
import { FaUpload } from 'react-icons/fa';
import './ImportBox.css';
import { useRef,useState,useEffect } from 'react';
import { FaDownload } from "react-icons/fa"
import axios from 'axios';
const UploadPage = ({modifications,setModifications}) => {
  const iframeRef = useRef(null);
  const valeur=useRef();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
const [selectedElement, setSelectedElement] = useState(null);
const [showModificationPanel, setShowModificationPanel] = useState(false);
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
    
    modifications?.forEach(mod => {
      // Common element targeting logic
      let elements = [];
      if (mod.limitFirst && !mod.limitStart) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(0, mod.limitFirst);
      }
      else if (mod.limitStart) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(mod.limitStart-1, mod.limitStart+mod.limitFirst-1);
      }
      else if (mod.limitLast) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(-mod.limitLast);
      } else if (mod.nthElement) {
        console.log(mod.nthElement)
        const allElements = Array.from(iframeDoc.querySelectorAll(mod.selector));
        elements = allElements[mod.nthElement - 1] ? [allElements[mod.nthElement - 1]] : [];
        console.log([allElements[mod.nthElement - 1]])
      } else if (mod.element) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.element));
        console.log(elements)
      }
    
      // Apply base styles
      if (elements.length) { 
        if (mod.createflex && mod.style.includes('display')) { 
         const wrapper = iframeDoc.createElement('div');
          console.log(mod.style) 
          wrapper.style.cssText = mod.style; 
          const parent = elements[0].parentNode; 
          parent.insertBefore(wrapper, elements[0]); 
          elements.forEach(el => wrapper.appendChild(el)); } 
          else { elements.forEach(el => { 
            console.log(mod.style) 
            el.style.cssText += mod.style; }); } }
    
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
  
const enableSelectionMode = () => {
  setIsSelectionMode(true);
  setShowModificationPanel(false);
  setSelectedElement(null);
};

const disableSelectionMode = () => {
  setIsSelectionMode(false);
  setSelectedElement(null);
  setShowModificationPanel(false);
  removeAllHighlights();
};
// ✅ AJOUTÉ - Configurer les événements de souris dans l'iframe
const setupSelectionEvents = () => {
  if (!iframeRef.current || !isSelectionMode) return;

  const iframe = iframeRef.current;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  const handleMouseOver = (e) => {
    if (!isSelectionMode) return;
    e.target.style.outline = '2px solid #007bff';
    e.target.style.cursor = 'pointer';
    e.target.style.transition = 'outline 0.2s ease';
  };

  const handleMouseOut = (e) => {
    if (!isSelectionMode) return;
    if (e.target !== selectedElement) {
      e.target.style.outline = '';
      e.target.style.cursor = '';
    }
  };

  const handleClick = (e) => {
    if (!isSelectionMode) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Retirer l'ancienne sélection
    if (selectedElement) {
      selectedElement.style.outline = '';
    }

    // Appliquer la nouvelle sélection
    const newSelectedElement = e.target;
    newSelectedElement.style.outline = '3px solid #ff0000';
    setSelectedElement(newSelectedElement);
    setShowModificationPanel(true);
  };

  // Ajouter les événements à tous les éléments
  const allElements = iframeDoc.querySelectorAll('*');
  allElements.forEach(element => {
    element.addEventListener('mouseover', handleMouseOver);
    element.addEventListener('mouseout', handleMouseOut);
    element.addEventListener('click', handleClick);
  });

  return () => {
    // Nettoyage
    allElements.forEach(element => {
      element.removeEventListener('mouseover', handleMouseOver);
      element.removeEventListener('mouseout', handleMouseOut);
      element.removeEventListener('click', handleClick);
    });
  };
};
// ✅ AJOUTÉ - Retirer les surlignages
const removeAllHighlights = () => {
  if (!iframeRef.current) return;
  const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
  const allElements = iframeDoc.querySelectorAll('*');
  allElements.forEach(element => {
    element.style.outline = '';
    element.style.cursor = '';
  });
};

// ✅ AJOUTÉ - Décrire l'élément sélectionné
const getElementDescription = () => {
  if (!selectedElement) return '';
  
  const tag = selectedElement.tagName.toLowerCase();
console.log(tag)

const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
console.log(iframeDoc)
  const allOfType = iframeDoc.querySelectorAll(tag);
  console.log(allOfType)
  // Get index of the selected element
  const nthElement = Array.from(allOfType).indexOf(selectedElement)+1 ;
  
  // Build JSON description
  const description = [{
    selector: tag,
    nthElement: nthElement
  }];
  
  return description;
};

useEffect(() => {
  if (isSelectionMode && iframeRef.current) {
    const cleanup = setupSelectionEvents();
    return cleanup; // Nettoyage
  }
}, [isSelectionMode, selectedElement]);
const newmod = (change) => {
  const base = getElementDescription();
  if (!base) return;

  base[0].style = change;

const newob=base[0]
console.log(newob)
  setModifications((prev) => [...prev, newob]);
  
};
console.log(modifications)
    useEffect(() => {
      
      if (iframeRef.current && modifications.length > 0) {
        applyModifications(iframeRef.current);
      }
    }, [modifications]);
 // ✅ AJOUTÉ - Barre d'outils et panel de modification
 const saveEditedHtml = async () => {
  const iframeDoc = iframeRef.current.contentDocument;
  const updatedHtml = iframeDoc.documentElement.outerHTML;

  await axios.post('http://localhost:5000/save-edited-html', {
    filename: 'index.html',
    content: updatedHtml,
  });

  alert('✅ Edited code saved!');
};
const handleExport = async () => {
  // Save edited content first
  await saveEditedHtml();

  // Then download zip
  window.location.href = "http://localhost:5000/export-folder";
}; 
return (
  <div style={{ width: '100%', height: '100vh', overflow: 'auto', backgroundColor: '#121212', position: 'relative' }}>
    
    {/* 🎯 BARRE D'OUTILS DE SÉLECTION */}
    {selectedHtml && (
      <div className="dynawep-toolbar">
        <div className="toolbar-content">
          <span id="toolbar-status">
            {isSelectionMode ? '🎯 Mode acivated' : 'activate'}
          </span>
          
          {!isSelectionMode ? (
            <button className="btn-primary" onClick={enableSelectionMode}>
              🎯 Select an element
            </button>
          ) : (
            <button className="btn-secondary" onClick={disableSelectionMode}>
              ✋ stop the selection
            </button>
          )}
          
          <button className="btn-danger" onClick={disableSelectionMode}>
            ❌ Annuler
          </button>
        </div>
      </div>
    )}
{selectedHtml && (
      <div className="dynawep-toolbarx">
        <div className="toolbar-content">
        <label  style={{ cursor: "pointer" }}>
      <div className="upload-buttonx" onClick={handleExport}>Export <FaDownload  /></div>
    </label>
          
        </div>
      </div>
    )}
    {/* 📝 PANEL DE MODIFICATION */}
    {showModificationPanel && selectedElement && (
      <div className="modification-panel">
        <div className="panel-header">
          <h3>✏️ Modify the element</h3>
          <button className="close-panel" onClick={() => setShowModificationPanel(false)}>×</button>
        </div>
        
        <div className="panel-content">
          <p><strong>Element selected:</strong> {JSON.stringify(getElementDescription(), null, 2)[0].selector}</p>
          
          <textarea 
          
          ref={valeur}
          rows="3"
          />
          
          <div className="panel-actions">
            <button className="btn-primary" onClick={() => newmod(valeur.current.value)}>
              ✅ Apply modification
            </button>
            <button className="btn-secondary" onClick={() => setShowModificationPanel(false)}>
              ✋ select another
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ✅ VOTRE CONTENU EXISTANT EST PRÉSERVÉ CI-DESSOUS */}
    <div style={{
      transform: 'scale(0.80)',
      transformOrigin: 'top left',
      width: '125%',
      height: '100vh',
      border: 'none',
    }}>
      {selectedHtml && (
        <iframe
          ref={iframeRef}
          src={`http://localhost:5000/uploads/${selectedHtml}`}
          title="Editable Website"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      )}
       
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
