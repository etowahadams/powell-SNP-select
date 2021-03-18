/**
 * Columns in the csv file
 */
export const header = [
  "Chip",
  "Plate_Location",
  "Population_Name",
  "no_accent_pop_name",
  "Sample",
  "CEL_file_name",
  "Sex",
  "Paternal_ID",
  "Maternal_ID",
  "Phenotype",
  "Notes",
  "Owner",
  "Private/Public",
  "City",
  "State/Province",
  "Country",
  "Region",
  "Latitude",
  "Longitude",
  "Year",
  "Include_in_chip_manuscript",
];

/**
 * Parses CSV file given the contents of a file. Adapted from https://stackoverflow.com/a/7431565
 * @param   {string} allText       all contents of a file
 * @return  {object}         object where keys are the same as csv header. Or {} if there are not 12 rows
 */
export const parseCSV = (allText) => {
  const allTextLines = allText.split(/\r\n|\n/);
  allTextLines.shift();

  const data = {};
  header.forEach((element) => {
    data[element] = [];
  });

  allTextLines.forEach((row) => {
    const vals = row.split(",");
    console.log(vals.length);
    console.log("header: " + header.length);

    vals.forEach((val, i) => {
      if (i < header.length) {
        // deal with the EOF
        data[header[i]].push(Number(vals[i]));
      }
    });
  });
  console.log(data);
  return data;
};

/**
 * Read contents of a file when we know the file path or url
 * @param   {string} url       url or file path of object
 * @return  {string}           contents of the file
 */
export const getFileContentsFromPath = async (url) => {
  const rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.open("GET", url, true); // true for async
  return new Promise((resolve, reject) => {
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          allText = rawFile.responseText;
          resolve(allText);
        } else {
          reject(
            new Error({
              status: rawFile.status,
              statusText: rawFile.statusText,
            })
          );
        }
      }
    };
    rawFile.send(null);
  });
};

// adapted from https://stackoverflow.com/a/1293163
export const CSVToArray = (strData) => {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  const strDelimiter = ",";
  const data = {};
  const header_len = 21

  header.forEach((element) => {
    data[element] = [];
  });

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      strDelimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      strDelimiter +
      "\\r\\n]*))",
    "gi"
  );

  let arrMatches = objPattern.exec(strData);

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  let idx = 0;
  while (arrMatches) {
    let strMatchedDelimiter = arrMatches[1];
    let strMatchedValue;
    // check if need to make a new row
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
      // let idx = 0;
    }
    if (arrMatches[2]) {
      // quoted value.
      strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
    } else {
      // non quoted value
      strMatchedValue = arrMatches[3];
    }

    
    data[header[idx % header_len]].push(strMatchedValue);
    idx++;
    arrMatches = objPattern.exec(strData)
  }
  return data;
}
