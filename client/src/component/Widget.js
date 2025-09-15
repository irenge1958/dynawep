import React from 'react';
import './Widget.css';
import { useState, useEffect } from 'react';
import tinycolor from "tinycolor2";
const Widget = ({modifications,setModifications}) => {
  function hasColorWord(str) {
    return str.includes('color');
}
function haspx(str) {
  return str.includes('px');
}

function hasrem(str) {
  return str.includes('rem');
}
function hass(str) {
  return str.endsWith('s');
}
function hasper(str) {
  return str.includes('%');
}
  function getBackgroundColor(obj,x) {
    
    const styleStr = obj[x].style;
   
  
    return hasColorWord(styleStr.split(':')[0].trim())?styleStr.split(':')[1].trim():styleStr.split(';').length>1?parseInt(styleStr.split(';')[1].trim().split(':')[1].trim(), 10):haspx(styleStr.split(':')[1].trim())?parseInt(styleStr.split(':')[1].trim(), 10):styleStr.split(':')[1].trim(); // Split and take the part after ":"
  }
  function styled(obj) {

    const styleStr = obj.style;
    return styleStr.split(':')[0].trim(); // Split and take the part after ":"
  }
  
  function replaceBackgroundColor(arr, newStyle,x) {
console.log(arr[x])
console.log(arr[x].style)
    return arr.map((obj, i) => 
       i === x ? { ...obj, style:obj.style.split(';').length>1?obj.style.replace(/^(([^;]+;){1})([^:]+:\s*)([^;]+)/, (_, before, __, prop, val) => {return before + prop + newStyle;}):obj.style.replace(/:[^;]+/, `:${newStyle}`) } : obj
  );
  }
  const Positiontype = [
    "static",    // Default position (not positioned)
    "relative",  // Positioned relative to its normal position
    "absolute",  // Positioned relative to the nearest positioned ancestor
    "fixed",     // Positioned relative to the viewport (stays in place on scroll)
    "sticky",    // Toggles between relative and fixed based on scroll position
];
  const fontfamilytype = [
    "Arial", 
    "Verdana", 
    "Helvetica", 
    "Tahoma", 
    "Trebuchet MS", 
    "Times New Roman", 
    "Georgia", 
    "Garamond", 
    "Courier New", 
    "Brush Script MT",
    "Lucida Console",
    "Palatino Linotype",
    "Segoe UI",
    "Roboto",
    "Open Sans",
    "Lora",
    "Merriweather",
    "Playfair Display",
    "Poppins",
    "Raleway"
  ];
  const overflowtype = [
    "visible",
    "hidden",
    "scroll",
    "auto",
    "clip"
  ];
  const cursortype = [
    "auto",         // Default (browser decides)
    "default",      // Standard arrow
    "pointer",      // Hand (for clickable elements)
    "text",         // I-beam (for selectable text)
    "move",         // Crosshair with arrows (draggable)
    "not-allowed",  // Red circle with line (disabled)
    "wait",         // Hourglass (processing)
    "help",         // Arrow with question mark
    "progress",     // Arrow with hourglass (async action)
    "crosshair",    // Plus sign (selection tools)
    "grab",         // Open hand (draggable)
    "grabbing",     // Closed hand (actively dragging)
    "zoom-in",      // Magnifying glass with "+"
    "zoom-out",     // Magnifying glass with "-"
    "col-resize",   // Horizontal resize (columns)
    "row-resize",   // Vertical resize (rows)
    "n-resize",     // Up arrow (north)
    "e-resize",     // Right arrow (east)
    "s-resize",     // Down arrow (south)
    "w-resize",     // Left arrow (west)
    "nesw-resize",  // Diagonal resize (northeast-southwest)
    "nwse-resize",  // Diagonal resize (northwest-southeast)
    "context-menu", // Arrow with context menu icon
    "cell",         // Grid cell selection (spreadsheets)
    "alias",        // Arrow with small arrow (link alias)
    "copy",         // Arrow with "+" (copy action)
    "no-drop",      // Hand with red circle (drop forbidden)
    "vertical-text",// Horizontal I-beam (vertical text)
    "all-scroll"    // Arrows in all directions (pan/scroll)
  ];
  const displayTypes = [
    "block",
    "inline",
    "inline-block",
    "none",
    "flex",
    "inline-flex",
    "grid",
    "inline-grid",
    "flow-root",
    "table",
    "inline-table",
    "table-row",
    "table-cell",
    "table-column",
    "list-item",
    "contents",
    "run-in",
    "inherit",
    "initial",
    "unset"
  ];
  const animatableProperties = [
    "background-color",
    "background-position",
    "background-size",
    "border",
    "border-color",
    "border-width",
    "border-spacing",
    "border-radius",
    "bottom",
    "box-shadow",
    "clip",
    "clip-path",
    "color",
    "column-count",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-width",
    "filter",
    "flex",
    "flex-basis",
    "flex-grow",
    "flex-shrink",
    "font",
    "font-size",
    "font-weight",
    "gap",
    "grid",
    "grid-area",
    "grid-column",
    "grid-column-gap",
    "grid-gap",
    "grid-row",
    "grid-row-gap",
    "grid-template",
    "height",
    "left",
    "letter-spacing",
    "line-height",
    "margin",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "max-height",
    "max-width",
    "min-height",
    "min-width",
    "object-position",
    "opacity",
    "order",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-width",
    "padding",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "perspective",
    "perspective-origin",
    "right",
    "scroll-margin",
    "scroll-padding",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-width",
    "text-decoration",
    "text-decoration-color",
    "text-indent",
    "text-shadow",
    "top",
    "transform",
    "transform-origin",
    "vertical-align",
    "visibility",
    "width",
    "word-spacing",
    "z-index"
  ];
  const textAlignValues = [
    "left",
    "right",
    "center",
    "justify",
    "start",
    "end",
    "match-parent"
  ];
  const heightValues = [
    /* Keyword values */
    "auto",          // Default: browser calculates height based on content
    "max-content",   // Expands to fit the largest content inside
    "min-content",   // Shrinks to the smallest possible height without overflow
    "fit-content",   // Fits content but respects min/max constraints
    "fit-content(<length-percentage>)", // With a constraint
    "inherit",
    "initial",
    "unset",
    "revert",
    "revert-layer"
  ];
  const backgroundColorValues = [
    /* Named colors */
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure",
    "beige", "bisque", "black", "blanchedalmond", "blue",
    "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
    "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson",
    "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray",
    "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange",
    "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue",
    "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
    "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen",
    "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
    "gray", "green", "greenyellow", "honeydew", "hotpink",
    "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue",
    "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred",
    "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite",
    "navy", "oldlace", "olive", "olivedrab", "orange",
    "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
    "palevioletred", "papayawhip", "peachpuff", "peru", "pink",
    "plum", "powderblue", "purple", "rebeccapurple", "red",
    "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown",
    "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue",
    "tan", "teal", "thistle", "tomato", "turquoise",
    "violet", "wheat", "white", "whitesmoke", "yellow",
    "yellowgreen",
  
    /* Keywords */
    "transparent",  // no background
    "currentColor", // inherits text color
  
    /* Global values */
    "inherit",
    "initial",
    "unset",
    "revert",
    "revert-layer"
  ]; 
  const fontWeightValues = [
    /* Keyword values */
    "normal",    // default weight (usually 400)
    "bold",      // bold (usually 700)
    "bolder",    // heavier than parent
    "lighter",   // lighter than parent
  
    /* Numeric values */
    100, 200, 300, 400, 500, 600, 700, 800, 900
  ];
  function transformString(input) {
    // Nettoyer l'input en supprimant les traits d'union
    const cleanInput = input.replace(/-/g, '').toLowerCase();
    
    // Déterminer quel tableau retourner en fonction de l'input
    switch(true) {
      case cleanInput.includes('font-family'):
        return fontfamilytype;
        case cleanInput.includes('height'):
          return heightValues;
          case cleanInput.includes('font-weight'):
            return fontWeightValues;
          case cleanInput.includes('background-color'):
          return backgroundColorValues;
      case cleanInput.includes('position'):
        return Positiontype;
        case cleanInput.includes('text-align'):
        return textAlignValues;
        case cleanInput.includes('transition-property'):
        return animatableProperties;
      case cleanInput.includes('cursor'):
        return cursortype;
        case cleanInput.includes('display'):
        return displayTypes;
      case cleanInput.includes('overflow'):
        return overflowtype;
      default:
        // Retourner un tableau vide si aucun type ne correspond
        return [];
    }
  }
  return (
    <div className="widget-container dark-theme">
      <h2 className="widget-title">Widget</h2>
      {modifications.map((x1,i)=>{
        return(<>{styled(x1)==='grid-template-columns'||styled(x1)==='filter'||styled(x1)==='transition'||styled(x1)==='box-shadow'?'':<div style={{display:'flex'}}><h2 style={{color:'white',marginTop:'-5px',flex:1}}>{i+1}.</h2><label style={{flex:9}} htmlFor="colorPicker" className="widget-title" >{x1.widget?x1.widget:`Change ${x1.element || x1.selector} ${styled(x1)}:`}</label>
        {hasColorWord(styled(x1)) ? (
   // Show color input
   <input
     id="colorPicker"
     type="color"
     value={tinycolor(getBackgroundColor(modifications, i)).toHexString()}
     onChange={(e) => {
       const rawValue = e.target.value;
       setModifications(replaceBackgroundColor(modifications, rawValue, i));
     }}
     style={{ cursor: 'pointer' }}
   />
 ) : typeof getBackgroundColor(modifications, i) === 'string' && getBackgroundColor(modifications, i) !== '0' && !hasper(getBackgroundColor(modifications, i)) && !haspx(getBackgroundColor(modifications, i)) && !hass(getBackgroundColor(modifications, i)) && !hasrem(getBackgroundColor(modifications, i))? (
   // Show select for text
   <select
     value={getBackgroundColor(modifications, i)}
     onChange={(e) => {
       const selectedValue = e.target.value;
       setModifications(replaceBackgroundColor(modifications, selectedValue, i));
     }}
     style={{ cursor: 'pointer' }}
   >
     <option value="" disabled>
     {getBackgroundColor(modifications, i)}
     </option>
    {transformString(styled(x1)).map((font) => (
     <option key={font} value={font} style={{ fontFamily: font }}>
       {font}
     </option>
   ))}
   </select>
 ) : (
   // Show number input
   <input
     type="number"
     value={parseFloat(getBackgroundColor(modifications, i))}
     onChange={(e) => {
       const rawValue = e.target.value;
      // Check for unit types
 const hasPx = haspx(x1.style.split(':')[1].trim());    // Checks for "px"
 const hasPer = hasper(x1.style.split(':')[1].trim());  // Checks for "%"
 const hasRem = hasrem(x1.style.split(':')[1].trim());  // Checks for "rem"
 const hasSec = hass(x1.style.split(':')[1].trim());    // Checks for "s"
 
 // Apply the same unit to the new value
 const processedValue = 
   hasPx ? `${rawValue}px` :
   hasPer ? `${rawValue}%` :
   hasRem ? `${rawValue}rem` :
   hasSec ? `${rawValue}s` :
   rawValue; // Fallback (no unit)
       setModifications(replaceBackgroundColor(modifications, processedValue, i));
     }}
     style={{ cursor: 'pointer' }}
   />
 )}
 </div>}<br></br></>)
      })}
      
    </div>
  );
};

export default Widget;
