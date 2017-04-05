"use strict";

const _ = require('lodash');
const hooks = require('./hooks');
const isSearch = require('../util/index').isSearch;

const isNotEmpty = arr => !_.isEmpty(arr);

const params = (element) => {
  const statements = [];
  try {
    let getAlls = element.resources.filter((resource) => {
      return isSearch(resource);
    });
    // loop through getAlls and test for correct params
    getAlls.forEach(resource => {
      console.log(resource.method + ': ' + resource.path);
      if(isNotEmpty(resource.parameters)) {
        let params = resource.parameters.map((param) => {
          // reduce param to just name
          return param.name;
        });
        // check params for mandatory values
        console.log(params);
        // add statements for missing params
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  hooks: hooks,
  params: params
};
