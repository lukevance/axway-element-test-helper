"use strict";

const isSearch = (resource) => {
  let getAll = false;
  if (resource.method === 'GET' && resource.type === 'api') {
    if (resource.path.indexOf('{') < 0){
      getAll = true;
    }
  }
  return getAll;
};

module.exports = {
  isSearch: isSearch
};
