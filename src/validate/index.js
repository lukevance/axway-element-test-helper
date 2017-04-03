"use strict";

const _ = require('lodash');
const hooks = require('./hooks');

const isNotEmpty = arr => !_.isEmpty(arr);

const params = (element) => {
  try {
    let getAlls = element.resources.filter((resource) => {
      return resource.method === 'GET' && (resource.path.indexOf('{') < 0);
    });
    element.resources.forEach(resource => {
      if(isNotEmpty(resource.parameters)) {
        
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  hooks: hooks
};
