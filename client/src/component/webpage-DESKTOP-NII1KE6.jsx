// web
import React from 'react';
import { FaCommentsDollar, FaUpload } from 'react-icons/fa';
import './ImportBox.css';
import { useRef,useState,useEffect } from 'react';
import { FaDownload } from "react-icons/fa"
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const UploadPage = ({modifications,setModifications,loading, setLoading}) => {
  const iframeRef = useRef(null);
  const valeur=useRef();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
const [selectedElement, setSelectedElement] = useState(null);
const [showModificationPanel, setShowModificationPanel] = useState(false);
  const [selectedHtml, setSelectedHtml] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [me,setME]=useState([])
  const [updatedrecently, setupdatedrecently] = useState(false);
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
  setLoading(true);
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
    } finally{
      setLoading(false);
    }
  };
  const applyModifications = (iframe) => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Create a style element for hover rules (added at top level)
    const styleTag = iframeDoc.createElement('style');
    iframeDoc.head.appendChild(styleTag);
    
    modifications?.forEach((mod, index)=> {
      // Common element targeting logic
      let elements = [];
      if (!mod.createflex && mod.limitFirst && !mod.limitStart && (mod.suppressed === undefined || mod.suppressed === null) ) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(0, mod.limitFirst);
      }
      else if (!mod.createflex && mod.limitStart &&  (mod.suppressed === undefined || mod.suppressed === null)) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(mod.limitStart-1, mod.limitStart+mod.limitFirst-1);
      }
      else if (!mod.createflex && mod.limitLast &&  (mod.suppressed === undefined || mod.suppressed === null)) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.selector)).slice(-mod.limitLast);
      } else if (!mod.createflex && mod.nthElement && !mod.newtext &&  (mod.suppressed === undefined || mod.suppressed === null)) {
        console.log(mod.processed,mod.style,mod.nthElement,mod.selector)
        const allElements = Array.from(iframeDoc.querySelectorAll(mod.selector));
        elements = allElements[mod.nthElement - 1] ? [allElements[mod.nthElement - 1]] : [];
        console.log(allElements[mod.nthElement - 1] ? [allElements[mod.nthElement - 1]] : [])
      } else if ( mod.element && (mod.suppressed === undefined || mod.suppressed === null) && !mod.createflex) {
        elements = Array.from(iframeDoc.querySelectorAll(mod.element));
        console.log(elements)
      }
     else if (mod.createflex && mod.style.includes('display') &&  (mod.suppressed === undefined || mod.suppressed === null)) { 
        console.log(mod.selectors)
        console.log(mod)
        console.log(Array.isArray(mod.selectors))
        console.log(Array.isArray(mod.selectors[0]))
        console.log(mod.selectors[0].element)
        const elementsToMove = mod.selectors
        .map(item => {
          const nodes = iframeDoc.querySelectorAll(item.element);
          console.log(nodes)
          console.log(item.nthElement)
          
          return nodes[Number(item.nthElement) - 1];
        })
        .filter(el => el); // remove undefined if position doesn't exist
       
        const wrapper = iframeDoc.createElement('div');
        
        
        console.log(elementsToMove)
        const first = elementsToMove[0];
        first.parentNode.insertBefore(wrapper, first);
        elementsToMove.forEach(el => {
          wrapper.appendChild(el);
        });
        console.log(wrapper)
        elements=[wrapper]
        const allOfType = Array.from(iframeDoc.querySelectorAll('div'));

        const index = allOfType.indexOf(wrapper) + 1;
        console.log(index)
        
          mod.nthElement = index;
     
        } 
      // Apply base styles
      if (elements) { 
        
        
            elements.forEach(el => {
            if (!el.hasAttribute("data-original-style")) {
              el.setAttribute("data-original-style", el.getAttribute("style") || "");
            }
            if (!el.hasAttribute("meid")) {
              el.setAttribute("meid", `${mod.id}`);
            }
         
            el.setAttribute("data-dynawep-modified", "true");
          
            // Get existing mods metadata
            let mods = el.getAttribute("data-dynawep-mods");
            mods = mods ? JSON.parse(mods) : [];
          
            // Add new modification
            const modProps = mod.style
              .split(";")
              .map(s => s.split(":")[0].trim())
              .filter(Boolean);
          
            mods.push({ id: index, props: modProps }); // assign a unique id per mod
          
            el.setAttribute("data-dynawep-mods", JSON.stringify(mods));
          
            // Apply the style
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
      if (mod.newtext && mod.nthElement) { 
        const elements = iframeDoc.querySelectorAll(mod.selector); // Get all matching elements
        const index = parseInt(mod.nthElement) - 1; // Convert position (1-based) to array index (0-based)
        const targetElement = elements[index]; // Get the element at that position
      
        if (targetElement) {
          targetElement.textContent = mod.newtext; // Change its text
        } else {
          console.warn(`No element found at position ${mod.position}`);
        }
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
  setSelectedElements([]);
};

const disableSelectionMode = () => {
  setIsSelectionMode(false);
  setSelectedElements([]);
  setShowModificationPanel(false);
  removeAllHighlights();
};
const removetheselection=()=>{
  setSelectedElements([]);
  setShowModificationPanel(false);
  console.log(me.length)
  if(me.length>0){
    setupdatedrecently(true)
  }
 
}
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
    if (!selectedElements.includes(e.target)) {
      e.target.style.outline = '';
      e.target.style.cursor = '';
    }
  };

  const handleClick = (e) => {
    if (!isSelectionMode) return;
  console.log(e.target)
const tag = e.target.tagName.toLowerCase();
  const iframe = iframeRef.current;
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  
  const allOfType = iframeDoc.querySelectorAll(tag);

  const myelement = Array.from(allOfType).indexOf(e.target) + 1;
  
 
  
  console.log(tag)
  console.log(allOfType)
  console.log(myelement)
  console.log(selectedElements)

   
  
 
  const transformedArray = selectedElements.map(el => {
    const value = el.getAttribute("meid");
  
    // Concatenate
    return `${value}`;
  });
  setModifications(prev =>
    prev.map(m => {
      console.log(`${e.target.getAttribute("meid")}`, m.id);
  
      return m.id === `${e.target.getAttribute("meid")}`
        ? { ...m, type: "first" }
        : { ...m, type: "second" };
    })
  );
  console.log(transformedArray,`${e.target.getAttribute("meid")}`);
  console.log(transformedArray[0]===`${e.target.getAttribute("meid")}`);
console.log(selectedElements,e.target)
console.log(`${e.target.getAttribute("meid")}`!=='null')
console.log(`${e.target.getAttribute("meid")}`)
console.log(transformedArray.includes(`${e.target.getAttribute("meid")}`) && (`${e.target.getAttribute("meid")}`!=='null'))
  if(transformedArray.includes(`${e.target.getAttribute("meid")}`) && (`${e.target.getAttribute("meid")}`!=='null')){
    console.log(selectedElements)
    setSelectedElements(
      selectedElements.filter((el) => {
        const value =el.getAttribute("meid");
        
        console.log(value,e.target.getAttribute("meid"))
        console.log(value !== e.target.getAttribute("meid"))
    
          console.log(e.target.getAttribute("meid"))
          return value !== e.target.getAttribute("meid");
       
      })
    );
    
    const element = e.target;
    element.style.outline = '';
    element.style.cursor = '';
   
  }else{
    setSelectedElements(prev => {
     // If already selected, remove it
     if (prev.includes(element)) {
      return prev.filter(x => x !== element);
    }

    // Otherwise add it
    element.classList.add("dynawep-selected");
    return [...prev, element];
    });
  }
    e.preventDefault();
    e.stopPropagation();
  
    const element = e.target;
  
   
    if(selectedElements.length === 0 && updatedrecently===true){
      removeAllHighlights(element);
      setupdatedrecently(false)
      console.log(updatedrecently)
    }
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
const removeAllHighlights = (myelement) => {
  if (!iframeRef.current) return;

  const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
  const allElements = iframeDoc.querySelectorAll('*');

  allElements.forEach(element => {
    // If myelement exists, skip it; otherwise remove styles
    if (!myelement || element !== myelement) {
      element.style.outline = '';
      element.style.cursor = '';
    }
  });
};

// ✅ AJOUTÉ - Décrire l'élément sélectionné
const getElementDescription = () => {
  if (!selectedElements || selectedElements.length === 0) return [];

  const relevantProperties = [
    "color",
    "background-color",
    "font-size",
    "font-family",
    "font-weight",
    "text-align",
    "gap",
    "margin",
    "margin-top",
    "margin-bottom",
    "margin-left",
    "margin-right",
    "padding",
    "padding-top",
    "padding-bottom",
    "padding-left",
    "padding-right",
    "width",
    "height",
    "border",
    "border-radius",
    "display",
    "position",
    "top",
    "left",
    "right",
    "bottom"
  ];

  const iframeDoc =
    iframeRef.current.contentDocument ||
    iframeRef.current.contentWindow.document;
console.log(selectedElements)
  const description = selectedElements.map(el => {

    const tag = el.tagName.toLowerCase();
    
    const computedStyle = iframeDoc.defaultView.getComputedStyle(el);

    const allOfType = iframeDoc.querySelectorAll(tag);

    const nthElement = Array.from(allOfType).indexOf(el) + 1;

    const styleObject = {};

    relevantProperties.forEach(prop => {
      styleObject[prop] = computedStyle.getPropertyValue(prop);
    });

    return {
      selector: tag,
      nthElement: nthElement,
      styleObject
    };
  });

  return description;
};
console.log(getElementDescription())
useEffect(() => {
  if (isSelectionMode && iframeRef.current) {
    const cleanup = setupSelectionEvents();
    return cleanup; // Nettoyage
  }
}, [isSelectionMode, selectedElements]);
useEffect(()=>{
  
  removetheselection()
  console.log(me)
 },[me])
const newmod = async (change) => {
  setLoading(true); 
  const base = getElementDescription();
  if (!base) return;

 

const newob=base[0]
const mychange = base.map((b) => {
  return `selector:${b.selector},nthelement:${b.nthElement},current style:${(JSON.stringify(b.styleObject, null, 2))}`
});

const groupId = "resize_" + crypto.randomUUID();
mychange.push(change)
console.log(selectedElements.length)
console.log(selectedElements[0].getAttribute("meid"))
if(selectedElements.length===1 && selectedElements[0].getAttribute("meid")){
  mychange.push(selectedElements[0].getAttribute("meid"))
}else{
  mychange.push(groupId)
}

console.log(mychange)
console.log(newob)
try {

  const response = await axios.post('http://localhost:5000/nlp/process-command', {
    
    command: mychange
  });
  
  console.log(response)
  console.log(response.data)
  console.log(response.data.operations)
setME(response.data.operations) 
  

  setModifications((prev) => [...prev,...response.data.operations]);
}catch (err) {
  console.error('Failed to fetch modifications', err);
}
  finally{
    setLoading(false);
  }
  
};
console.log(modifications)
function getUniqueSelector(el, dom) {
  if (!el || !el.tagName) return '';

  // Default to entire document if no DOM scope provided
  const root = dom || document;

  // Get all elements of the same tag type in the whole DOM
  const allOfType = Array.from(root.querySelectorAll(el.tagName));

  // Find the element’s global index
  const index = allOfType.indexOf(el) + 1; // nth-of-type is 1-based

  // Return a selector like "div:nth-of-type(2)"
  return index;
}


useEffect(() => {
  if (!iframeRef.current) return;

  const iframeDoc =
    iframeRef.current.contentDocument ||
    iframeRef.current.contentWindow.document;

  // Find suppressed modifications that are not processed
  const suppressedMods = modifications.filter(m => m.suppressed !== undefined && m.suppressed !== null && !m.processed);
console.log(suppressedMods)
  if (suppressedMods.length > 0) {
    suppressedMods.forEach(mod => {
      const elements = iframeDoc.querySelectorAll(mod.selector) || iframeDoc.querySelectorAll(mod.element);
      console.log(elements)
      elements.forEach(el => {
       const sel=getUniqueSelector(el,iframeDoc)
       console.log(sel)
if(mod.selector && mod.nthElement!==sel){
  console.log(mod.selector)
return ;
}
        // Read stored mods on element
        let mods = JSON.parse(el.getAttribute("data-dynawep-mods") || "[]");
console.log(mods)
        // Find the mod entry
 
        const modEntry = mods.find(m => m.id === mod.suppressed);
console.log('toremove',modEntry)
        if (modEntry) {
console.log(el.style.length)
console.log(el.style)
          // Remove its properties
          modEntry.props.forEach(p => el.style.removeProperty(p));
console.log(el.style.length)
console.log(el.style)
          // Remove entry
          mods = mods.filter(m => m.id !== mod.suppressed);

          // Save back
          el.setAttribute("data-dynawep-mods", JSON.stringify(mods));
        }

        // If no modifications left → restore original style
        if (mods.length === 0) {
          const original = el.getAttribute("data-original-style") || "";
          el.setAttribute("style", original);
          el.removeAttribute("data-original-style");
          el.removeAttribute("data-dynawep-modified");
          el.removeAttribute("data-dynawep-mods");
        }
      });
    });

    // Mark all suppressed modifications as processed so they don't run again
    setModifications(prev =>
      prev.map(m =>
        m.suppressed !== undefined && m.suppressed !== null ? { ...m, processed: true} : m
      )
    );
  }
console.log(modifications)
  // Reapply active mods
  applyModifications(iframeRef.current);
}, [modifications]);
const handleClose = () => {
  setShowModificationPanel(false);  // hide the panel
  removeAllHighlights(selectedElement); // example: call another function
  console.log("Panel closed!");       // do anything else you need
};

 // ✅ AJOUTÉ - Barre d'outils et panel de modification
 const saveEditedHtml = async () => {
  const iframeDoc = iframeRef.current.contentDocument;
  const updatedHtml = iframeDoc.documentElement.outerHTML;

  await axios.post('http://localhost:5000/save-edited-html', {
    filename: 'index.html',
    content: updatedHtml,
  });
  // 🔥 FORCE reload updated HTML
  iframeRef.current.src = iframeRef.current.src.split("?")[0] + "?t=" + Date.now();
  alert('✅ Edited code saved!');
};
const handleExport = async () => {
  // Save edited content first
  await saveEditedHtml();

  // Then download zip
  window.location.href = "http://localhost:5000/export-folder";
}; 
return (
  <div style={{ width: '100%', height: '100vh', overflow: 'auto', position: 'relative' }}>
   {loading && <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // transparent black background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999999,
          }}
        >
          <Box
            sx={{
             
              borderRadius: '20px',
              padding: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <CircularProgress size={80} thickness={5} color="inherit" />
            <p style={{ color: 'white', marginTop: '20px', fontSize: '18px' }}>Processing...</p>
          </Box>
        </Box>}  
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
            ❌ cancel
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
    {showModificationPanel && selectedElements && (
      <div className="modification-panel">
        <div className="panel-header">
          <h3>✏️ Modify the element</h3>
          <button className="close-panel" onClick={() => handleClose()}>×</button>
        </div>
        
        <div className="panel-content">
        <p>
  <strong>Elements selected:</strong>{Array.isArray(getElementDescription()) &&
  getElementDescription().map(a => a.selector).join(", ")
}

</p>

          
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
      height: '100%',
      overflow: 'hidden',
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
