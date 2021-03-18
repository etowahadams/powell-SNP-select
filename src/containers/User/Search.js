import React, { useState, useEffect } from "react";
import {
  parseCSV,
  getFileContentsFromPath,
  CSVToArray,
} from "../../utils/files";
import sampleData_path from "../../SNP_data.csv";
import PopForm from "../../components/PopForm";
import { Container, Row, Col, Table } from "react-bootstrap";

const Search = () => {
  const [SNPData, setSNPData] = useState({}); // processed SNP data from csv for vis
  const [filterData, setFilterData] = useState({
    pop: [],
    years: [],
    owner: [],
  }); // holds data extracted from csv files
  const [searchOptions, setSearchOptions] = useState({
    poplist: [],
    popselect: [],
    yearselect: [],
    ownerselect: [],
    dataselect: [],
    root: ''
  });
  const [rows, setRows] = useState([]);

  const renameUnknowns = (arr) => {
    let index = arr.indexOf("");
    if (index !== -1) {
      arr[index] = "Unknown";
    }
    return arr;
  };
  /**
   * Read contents of SNP data file, then sets the contents setSNPData()
   */
  const getData = async () => {
    const contents = await getFileContentsFromPath(sampleData_path);
    const formattedData = CSVToArray(contents);
    console.log(formattedData);
    formattedData["no_accent_pop_name"].forEach((name, i) => {
      if (name === "") {
        alert(
          "There is a sample without a population associated with it, check csv formatting"
        );
      }
    });
    // shift columns used to get rid of the column name
    ["no_accent_pop_name", "CEL_file_name", "Year", "Owner", "Notes"].forEach(
      (col) => {
        formattedData[col].shift();
      }
    );

    let populations = [...new Set(formattedData["no_accent_pop_name"])].sort();
    let years = [...new Set(formattedData["Year"])].sort();
    let owners = [...new Set(formattedData["Owner"])].sort();
    years = renameUnknowns(years);
    owners = renameUnknowns(owners);
    setFilterData({ pop: populations, years: years, owner: owners });
    setSNPData(formattedData);
  };
  /**
   * Based searchOptions (selected with PopForm), fiter csv and return the indices
   * of the rows matching search
   * TODO: refactor the "include = include || " statements into a function
   * @param   {object} searchOptions
   * { poplist: [], popselect: [], yearselect: [], ownerselect: [], dataselect: [],}
   */
  const showSelected = (selected) => {
    console.log(selected);
    let results = [];
    let include = false;
    if (SNPData["Year"]) {
      const selectedPops = [...new Set([...selected.poplist, ...selected.popselect])]
      console.log(selectedPops)

      SNPData["Year"].forEach((year, i) => {
        // see TODO
        include =
          selectedPops.length === 0 ||
          selectedPops.some((pop) => {
            return pop === SNPData["no_accent_pop_name"][i];
          });

        include =
          include &&
          (selected.yearselect.length === 0 ||
            selected.yearselect.some((year) => {
              if (year === "Unknown") {
                return "" === SNPData["Year"][i]
              } else {
                return year === SNPData["Year"][i];
              }
            }));
        include =
          include &&
          (selected.ownerselect.length === 0 ||
            selected.ownerselect.some((owner) => {
              return owner === SNPData["Owner"][i];
            }));
        include =
          include &&
          (selected.dataselect.length === 0 ||
            selected.dataselect[0] === "All" ||
            (selected.dataselect[0] === "GWAS" &&
              SNPData["Notes"][i].includes("GWAS")));
        if (include) {
          results.push(i);
        }
      });
    }

    return results;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const indices = showSelected(searchOptions);
    setRows(indices);
  }, [searchOptions]);

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <p>Read data from {sampleData_path}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <PopForm
            filterData={filterData}
            setOptions={setSearchOptions}
          ></PopForm>
        </Col>
      </Row>
      <Row>
        <Col>
        <hr></hr>
        <h3>File paths</h3>
          {rows.map((i) => (
            <div>
              {searchOptions['root']}{SNPData["no_accent_pop_name"][i]}/{SNPData["CEL_file_name"][i]}.CEL
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
