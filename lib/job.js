const axios = require('axios');
const Parser = require('rss-parser');

class Job {
  constructor(name, position, description, suburb) {
    this._name = name;
    this._position = position;
    this._description = description;
    this._suburb = suburb;
  } 
  getName() { return this._name; }
  getPosition() { return this._position; }
  getDesc() { return this._description; }
  getSuburb() { return this._suburb; }
}
function getJobs(query, suburb) {
  return new Promise((resolve, reject) => {
    axios.get("https://stackoverflow.com/jobs/feed", {
      params: {
        q: query,
        l: suburb,
        d: 100,
        u: "Km",
      }
    }).then(resolvedXML => {
      let parser = new Parser();
      parser.parseString(resolvedXML.data).then(v => {
        resolve(v.items.map(obj => {
          const LOCATION_START= obj.title.lastIndexOf("(") + 1;
          const LOCATION_END = obj.title.length - 1;

          const NAME_DELIM = " at";
          const NAME_END = obj.title.indexOf(NAME_DELIM)

          const description = obj.contentSnippet;
          const suburb = obj.title.slice(LOCATION_START, LOCATION_END);
          const position = obj.title.slice(0, NAME_END);
          const name = obj.title.slice(NAME_END+NAME_DELIM.length + 1, LOCATION_START - 2);

          // Audit Analyst at Queensland Audit Office (Brisbane, Australia)
          let result = new Job(name, position, description, suburb);
          return result;
        }));
      })
      .catch(e => {
        reject(e);
      }); 
    }).catch(e => {
      reject(e);
    });
  });
}

module.exports = {
  getJobs: getJobs,
  Job: Job,
}
