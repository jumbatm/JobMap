const axios = require('axios');
const Parser = require('rss-parser');

class Job {
  constructor(title, link, content, suburb) {
    this._title = title;
    this._link = link;
    this._content = content;
    this._suburb = suburb;
  } 
  getTitle() { return this._title; }
  getLink() { return this._link; }
  getContent() { return this._content; }
  getSuburb() { return this._suburb; }
}
function getJobs(query, suburb) {
  return new Promise((resolve, reject) => {
    axios.get("https://stackoverflow.com/jobs/feed", {
      params: {
        l: suburb,
        q: query,
        u: "Km",
        d: 20,
      }
    }).then(resolvedXML => {
      let parser = new Parser();
      parser.parseString(resolvedXML.data).then(v => {
        resolve(v.items.map(obj => {
          let re = /\((.+?)\)/g;
          let s;
          let matches = [];
          while (s = re.exec(obj.title)) {
            matches.push(s);
          }
          matches = matches.filter(match => match[1] !== "allows remote");
          console.log(matches);
          const suburb = matches[matches.length-1][1];

          // Audit Analyst at Queensland Audit Office (Brisbane, Australia)
          let result = new Job(obj.title, obj.link, obj.contentSnippet, suburb);
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
