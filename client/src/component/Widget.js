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
console.log(obj)
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
  const borderStyle=[
    "none",
    "solid",
    "dashed",
    "dotted",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "hidden"
  ]
  const textDecoration=[
    "none",
    "underline",
    "overline",
    "line-through",
    "blink"
  ]
  const backgroundSize=[
    "auto",
    "cover",
    "contain",
    "100% 100%",
    "50% 50%",
    "100px 200px"
  ]
 const alignItems= [
    "stretch",   // Default: items stretch to fill the container
    "flex-start",// Align items at the start of the cross axis
    "flex-end",  // Align items at the end of the cross axis
    "center",    // Align items in the center of the cross axis
    "baseline",  // Align items so their text baselines line up
    "normal",    // Uses the default browser behavior (varies by context)
    "start",     // Align items at the start (logical, based on writing mode)
    "end",       // Align items at the end (logical, based on writing mode)
    "self-start",// Align items to the start of their own box
    "self-end"   // Align items to the end of their own box
  ]
 const justifyContent= [
    "flex-start",     // Items packed toward the start of the main axis
    "flex-end",       // Items packed toward the end of the main axis
    "center",         // Items centered along the main axis
    "space-between",  // Even spacing, first item at start, last at end
    "space-around",   // Even spacing with half-size gaps at edges
    "space-evenly",   // Equal spacing between items and edges
    "start",          // Logical start of the main axis (depends on writing mode)
    "end",            // Logical end of the main axis
    "left",           // Align items to the left (applies in certain contexts)
    "right",          // Align items to the right (applies in certain contexts)
    "normal"          // Default browser behavior (depends on layout type)
  ]
  const boxSizing=[
    "content-box", // Default: width/height apply only to content, padding & border are added outside
    "border-box",  // Width/height include padding and border
    "inherit",     // Inherit value from parent
    "initial",     // Reset to default (content-box)
    "unset"        // Resets to inherited or initial depending on context
  ]
 const backgroundRepeat=[
    "repeat",        // Tiles both horizontally & vertically (default)
    "repeat-x",      // Repeats horizontally only
    "repeat-y",      // Repeats vertically only
    "no-repeat",     // Shows the background image once
    "space",         // Repeats without clipping, adds space between images
    "round",         // Repeats and scales so images fit perfectly
    "inherit",       // Inherits from parent
    "initial",       // Resets to default (repeat)
    "unset"          // Resets to inherited or initial
  ]
 const textTransform=[
    "none",        // Default: no transformation
    "capitalize",  // Capitalizes the first letter of each word
    "uppercase",   // Transforms all letters to uppercase
    "lowercase",   // Transforms all letters to lowercase
    "full-width",  // Converts to full-width characters (for East Asian text)
    "inherit",     // Inherits from parent
    "initial",     // Resets to default (none)
    "unset"        // Resets to inherited or initial
  ]
  const opacitys=[
    "0",    // Fully transparent
    "0.1",
    "0.2",
    "0.3",
    "0.4",
    "0.5",
    "0.6",
    "0.7",
    "0.8",
    "0.9",
    "1",    // Fully opaque
    "inherit",
    "initial",
    "unset"
  ]
  
  function transformString(input) {
    // Nettoyer l'input en supprimant les traits d'union
    const cleanInput = input.replace(/-/g, '').toLowerCase();
    
    // Déterminer quel tableau retourner en fonction de l'input
    switch(true) {
      case cleanInput.includes('fontfamily'):
        return fontfamilytype;
        case cleanInput.includes('texttransform'):
        return textTransform;
        case cleanInput.includes('opacity'):
          return opacitys;
        case cleanInput.includes('backgroundrepeat'):
          return backgroundRepeat;
        case cleanInput.includes('boxsizing'):
        return boxSizing;
        case cleanInput.includes('justifycontent'):
          return justifyContent;

        case cleanInput.includes('backgroundsize'):
          return backgroundSize;
        case cleanInput.includes('height'):
          return heightValues;
          case cleanInput.includes('borderstyle'):
          return borderStyle;
          case cleanInput.includes('alignitems'):
          return alignItems;
          case cleanInput.includes('textdecoration'):
          return textDecoration;
          case cleanInput.includes('fontweight'):
            return fontWeightValues;
          case cleanInput.includes('backgroundcolor'):
          return backgroundColorValues;
      case cleanInput.includes('position'):
        return Positiontype;
        case cleanInput.includes('textalign'):
        return textAlignValues;
       
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
        return(<>{styled(x1)==='grid-template-columns'||styled(x1)==='filter'||styled(x1).includes('transition')||styled(x1)==='box-shadow'?'':<div style={{display:'flex'}}><h2 style={{color:'white',marginTop:'-5px',flex:1}}></h2><label style={{flex:9}} htmlFor="colorPicker" className="widget-title" >{x1.widget?x1.widget:`Change ${x1.element || x1.selector} ${styled(x1)}:`}</label>
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
