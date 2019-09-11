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
function getJobs(query) {
  return new Promise((resolve, _) => {
    resolve([
      new Job("Oracle Labs", "Graduate Research Engineer", "Looking for C++ and compilers background", "Brisbane, Australia"),
      new Job("Queensland Audit Office", "Audit Analyst", "Looking for someone good with SQL", "Brisbane, Australia"),
      new Job("McDonalds Underwood", "Crew", "Looking for someone to make burgers", "Underwood, Queensland, Australia")
    ]);
  });
}

module.exports = {
  getJobs: getJobs,
  Job: Job,
}
