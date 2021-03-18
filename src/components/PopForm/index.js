import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./index.css";

const PopForm = ({ filterData, setOptions }) => {
  const [selected, setSelected] = useState({
    poplist: [],
    popselect:[],
    yearselect:[],
    ownerselect:[],
    dataselect:[],
    root: ''
  })
  const handleSubmit = (event) => {
    event.preventDefault();
    setOptions(selected)
  };
  const handleChange = (event) => {
    let val;
    if (event.target.selectedOptions) {
      val = Array.from(event.target.selectedOptions, option => option.value)
    } else if (event.target.name === "root") {
      val = event.target.value
    } else {
      val = event.target.value
      val.replace(/ /g,'')
      val = val.split(",")
    }
    // data[event.target.name] = val
    setSelected({...selected, [event.target.name]: val})
    console.log(val)
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h4>Population Selection</h4>
      <Form.Group controlId="Select.poplist">
        <Form.Label>Enter list of populations (separated by commas)</Form.Label>
        <Form.Control
          name="poplist"
          onChange={handleChange}
          as="textarea"
          rows={3}
          placeholder="ex: Jacobina, Juazeiro, Sedhiou"
        />
      </Form.Group>
      <Form.Group controlId="Select.popselect">
        <Form.Label>
          Or select populations (ctrl+click to select multiple). Default: Any
        </Form.Label>
        <Form.Control
          as="select"
          name="popselect"
          onChange={handleChange}
          multiple
          className={"large-select"}
        >
          {filterData["pop"].map((pop) => (
            <option key={pop}>{pop}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="Select.popselect">
        <Form.Label>Select years. Default: Any</Form.Label>
        <Form.Control
          name="yearselect"
          onChange={handleChange}
          as="select"
          multiple
        >
          {filterData["years"].map((year) => (
            <option key={year}>{year}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="Select.owner">
        <Form.Label>Select owner. Default: Any</Form.Label>
        <Form.Control
          name="ownerselect"
          onChange={handleChange}
          as="select"
          multiple
        >
          {filterData["owner"].map((owner) => (
            <option key={owner}>{owner}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="Select.datatype">
        <Form.Label>Select type of data. Selecting "GWAS" will get all the sames with "GWAS" in the notes.</Form.Label>
        <Form.Control 
          name="dataselect"
          onChange={handleChange}
          as="select">
          <option>All</option>
          <option>GWAS</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="Select.root">
        <Form.Label>Enter root directory</Form.Label>
        <Form.Control
          name="root"
          onChange={handleChange}
          placeholder="ex: Z:/User/data/"
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default PopForm;
