const getPUTQuery = (table, cols, idName, id) => {
  // Setup static beginning of query
  const initQuery = [`UPDATE ${table}`];
  initQuery.push("SET");

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + " = $" + (i + 1));
  });
  initQuery.push(set.join(", "));

  // Add the WHERE statement to look up by id
  initQuery.push(`WHERE ${idName} = '${id}'`);

  const query = initQuery.join(" ");

  const colsArr = Object.keys(cols).map(function (key) {
    return cols[key];
  });
  // Return a complete query string
  return { query, colsArr };
};

module.exports = getPUTQuery;
