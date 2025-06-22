import React, { useState } from 'react';
import './App.scss';
import { PieChart, type DataSet } from 'simple-as-pie';
import Alert from '@mui/material/Alert';
import { Button, Card, CardActions, CardContent, Container, TextField, Grid, CardHeader } from '@mui/material';


const colourBits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];

const generateRandomColour = () => {
  let output = "#";
  for(var i = 0; i < 6; i++) {
    let colourIndex = Math.floor(Math.random() * 16);
    output += colourBits[colourIndex];
  }

  return output;
}


const demoProps = {
  width: 300,
  height: 300,
  x: 150,
  y: 150,
  radius: 100
}

const App = () => {
  const [svgProps, setSvgProps] = useState(demoProps);
  const [alert, setAlert] = useState<null | string>(null);

  const clickedFunction = (event: React.PointerEvent, data: DataSet) => {
    console.log("Segment clicked", event.currentTarget);
    setAlert(`You just clicked the segment with colour ${data.colour}`);
  }

  const closeAlert = () => {
    setAlert(null);
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
  const [data, setData] = useState(demodata);

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
    if(Number(value) <= 0) {
      return;
    }

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
    <main className="app-container">
      <Grid container padding="20px" spacing={4}>
        <Container maxWidth="md">
          <Grid container columns={1}>
            <Grid display="flex" justifyContent="center" alignItems="center" size="grow" flexShrink={0} flexBasis="100%">
              <h1>Simple-as-pie Demo</h1>
            </Grid>          
            <Grid>
              <p>This was built using <a href="https://github.com/Arad1el/simple-as-pie/tree/v2.2.4">Simple-As-Pie v2.2.4</a></p>
              <p><a href="https://github.com/Arad1el/simple-as-pie-demo-page">View the source code for this page</a></p>
              <p>Feel free to play around with the parameters for the segments, or adding and deleting them.</p>
              <p>Pointer Up events are now included, so click on a segment to see that in action</p>
            </Grid>
          </Grid>
        </Container>   
        
        <Container maxWidth="lg">
          <Grid container spacing={4} padding="20px">
            <Grid container spacing={4} size={12}>
              {data.map((dataEntry, index) => (
                <Grid key={index} spacing={4} size={6}>
                  <Card className="data-entry">
                    <CardContent className='data-entry-fields'>
                      <TextField
                        className='data-entry-field'
                        required
                        label="Value"
                        type="number"
                        onChange={(event) => handleValueChange(event.target.value, index)}
                        value={dataEntry.value}
                      />
                      <TextField
                        className='data-entry-field'
                        required
                        label="Colour"
                        type="text"
                        onChange={(event) => handleColourChange(event.target.value, index)}
                        value={dataEntry.colour}
                      />
                    </CardContent>
                    <CardActions className='data-entry-actions'>
                      <Button variant="contained" className="delete" onClick={() => deleteEntry(index)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Grid size={12}>
              <Button variant="contained" className="add-more" onClick={addMoreData}>Add more data</Button>
            </Grid>
            <Grid container spacing={4}>
              <Card>
                <CardHeader title="Output" />
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid className='output-controls' size={{xs: 12, sm: 4, md: 3}}>
                      <Container>
                        <TextField
                          required
                          label="SVG Width"
                          name="width"
                          type="number"
                          onChange={handleSvgChange}
                          value={svgProps.width}
                        />
                        <TextField
                          required
                          label="SVG Height"
                          name="height"
                          type="number"
                          onChange={handleSvgChange}
                          value={svgProps.height}
                        />
                        <TextField
                          required
                          label="Pie Chart X"
                          name="x"
                          type="number"
                          onChange={handleSvgChange}
                          value={svgProps.x}
                        />
                        <TextField
                          required
                          label="Pie Chart Y"
                          name="y"
                          type="number"
                          onChange={handleSvgChange}
                          value={svgProps.y}
                        />
                        <TextField
                          required
                          label="Pie Chart Radius"
                          name="radius"
                          type="number"
                          onChange={handleSvgChange}
                          value={svgProps.radius}
                        />
                      </Container>
                    </Grid>
                    <Grid className='output-visual' size="grow">
                      <Grid size={12} minHeight={{xs:70, md: 50}}>
                      {alert ? (
                        <Alert severity='info' onClose={closeAlert}>
                        {alert}
                      </Alert>
                      ) : null}
                      </Grid>
                      <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
                        <svg className='output-svg' width={svgProps.width + "px"} height={svgProps.height + "px"}>
                          <PieChart x={svgProps.x} y={svgProps.y} data={data} radius={svgProps.radius} />
                        </svg>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Grid>
  </main>
  );
}

export default App;
