import React, { PointerEventHandler, useState } from 'react';
import './App.scss';
import { PieChart, DataSet } from 'simple-as-pie';

const colourBits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];

const generateRandomColour = () => {
  let output = "#";
  for(var i = 0; i < 6; i++) {
    let colourIndex = Math.floor(Math.random() * 16);
    output += colourBits[colourIndex];
  }

  return output;
}

const clickedFunction: PointerEventHandler = (event: React.PointerEvent) => {
  const clickedColour = event.currentTarget.attributes.getNamedItem("fill")?.nodeValue;
  if (clickedColour) {
    alert(`You just clicked the segment with the colour ${clickedColour}`);
  }
}

const demodata: DataSet[] = [
  {
    value: Math.round(Math.random() * 100),
    colour: generateRandomColour(),  
    events: {
      onPointerUp: clickedFunction
    }
  },
  {
    value: Math.round(Math.random() * 100),
    colour: generateRandomColour(),
    events: {
      onPointerUp: clickedFunction
    }
  }
];

const demoProps = {
  width: 300,
  height: 300,
  x: 150,
  y: 150,
  radius: 100
}

const App = () => {
  const [data, setData] = useState(demodata);
  const [svgProps, setSvgProps] = useState(demoProps);
 
  const addMoreData = () => {
    const newEntry: DataSet = {
      value: Math.round(Math.random() * 100),
      colour: generateRandomColour(),
      events: {
        onPointerUp: clickedFunction
      }
    };
    setData([ // with a new array
      ...data, // that contains all the old items
      newEntry // and one new item at the end
    ]);
  }
  
  const handleColourChange = (value: string, index: number) => {    
    let currentData = [...data];
    let currentEntry = currentData[index];
    currentEntry.colour = value;
    
    currentData[index] = currentEntry;
    setData(currentData);
  }
  
  const handleValueChange = (value: string, index: number) => {    
    let currentData = [...data];
    let currentEntry = currentData[index];
    currentEntry.value = Number(value);
    
    currentData[index] = currentEntry;
    setData(currentData);
  }
  
  const deleteEntry = (index: number) => {   
    let currentData = [...data];
    let newData = currentData.slice(0, index).concat(currentData.slice(index+1));
        
    setData(newData);
  }
  
  const handleSvgChange = (event: React.SyntheticEvent) => {
    let target = event.target as HTMLInputElement;
    const propName = target.name;
    const propVal = target.value;
    
    setSvgProps(values => ({...values, [propName]: propVal}))
  }

  return (
    <div className="app-container">
      <h1>Simple-as-pie Demo</h1>      
      
      <div>
        <p>This was built using <a href="https://github.com/Arad1el/simple-as-pie/tree/v2.1.3">Simple-As-Pie v2.1.3</a></p>
        <p>Feel free to play around with the parameters for the segments, or adding and deleting them.</p>
        <p>Pointer Up events are now included, so click on a segment to see that in action</p>
      </div>

      <div className="svg-props">
        <h2>Svg properties</h2>
        <div className="svg-prop-inputs">
          <label>Width:</label>
          <input type="number" name="width" value={svgProps.width} onChange={handleSvgChange} />
          <label>Height:</label>
          <input type="number" name="height" value={svgProps.height} onChange={handleSvgChange} />
        </div>
      </div>

      <div className="data-section">
        <h2>DataSet entries</h2>
        <div className="data-entries">
          {data.map(({value, colour}, index) => (
            <div key={index} className="data-entry">
              <div className="left">
              <label>Value:</label><input type="number" value={value} name="value" onChange={(event) => handleValueChange(event.target.value, index)} />
              
              <label>Colour:</label><input type="text" value={colour} name="colour" onChange={(event) => handleColourChange(event.target.value, index)} />
                  </div>
                  <div className="right">
                    <button className="delete" onClick={() => deleteEntry(index)}>Delete</button>
                  </div>
            </div>
          ))}
        </div>
        <button className="add-more" onClick={addMoreData}>Add more data</button>
      </div>

      <div className="chart-props">
        <h2>PieChart component properties</h2>
        <div className="chart-prop-inputs">
          <label>X:</label>
          <input type="number" name="x" value={svgProps.x} onChange={handleSvgChange} />
          <label>Y:</label>
          <input type="number" name="y" value={svgProps.y} onChange={handleSvgChange} />
          <label>Radius:</label>
          <input type="number" name="radius" value={svgProps.radius} onChange={handleSvgChange} />
        </div>
      </div>
      
      <div className="svg-output">
        <h2>Output</h2>
        <svg width={svgProps.width + "px"} height={svgProps.height + "px"}>
          <PieChart x={svgProps.x} y={svgProps.y} data={data} radius={svgProps.radius} />
        </svg>
      </div>
  </div>
  );
}

export default App;
