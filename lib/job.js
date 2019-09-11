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
function getJobs() {
  let result = [
    new Job("Oracle Labs", "Graduate Research Engineer", "Looking for C++ and compilers background", "Brisbane CBD"),
    new Job("Queensland Audit Office", "Audit Analyst", "Looking for someone good with SQL", "Brisbane CBD"),
    new Job("McDonalds Underwood", "Crew", "Looking for someone to make burgers", "Underwood")
  ];
}
