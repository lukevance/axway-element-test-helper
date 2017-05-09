"use strict";
const fs = require('fs');
const chalk = require('chalk');

// function to remove amazon pieces from swagger
const removeAmazon = (swagger, fileName) => {
  let propertyPathString = 'paths.all';
  try {
    if (swagger && propertyPathString) {
      let propertyPath = propertyPathString.split('.');
      // check for levels of proprety
      if (propertyPath[0] === 'paths') {
        if (propertyPath[1] && swagger.paths[propertyPath[1]]) {
          // delete for just one
        } else if (propertyPath[1] === 'all') {
          // create array of keys below first path key
          let resources = Object.keys(swagger[Object.keys(swagger)[Object.keys(swagger).indexOf(propertyPath[0])]]);
          // loop through resources
          resources.forEach((resource) => {
            let methods = Object.keys(swagger[propertyPath[0]][resource]);
            // loop through methods
            methods.forEach((method) => {
              if (Object.keys(swagger.paths[resource][method]).indexOf('x-amazon-apigateway-integration')) {
                console.log(resource + ': ' + method);
                delete swagger.paths[resource][method]['x-amazon-apigateway-integration'];
              }
            });
          });
          fs.writeFile('NEW_' + fileName, JSON.stringify(swagger), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
        } else {
          // TODO: deal with wrong nested prop
          console.log('you only provided 1 level of property path');
        }
      } else {
        throw 'The property ' + chalk.blue(propertyPathString) + ' was not found or is not supported';
      }
    } else {
      throw 'Please provide valid swagger and property path';
    }
  } catch (e) {
    console.log(e);
  }
};

// function to list all resources in an element JSON
const listParams = (element) => {
  if (element.resources && (element.resources.length > 0)) {
    let count = 0;
    element.resources.forEach((resource) => {
      if (resource.path) {
        count++;
          // console.log(chalk.blue(resource.method + ": " + resource.path));
          let version = false;
          // loop through each param for resource
          resource.parameters.forEach((param) => {
            if (param.name === 'api.version'){
              // console.log(chalk.blue(resource.method + ": " + resource.path));
              version = true;
            }
            if (!version){
              console.log(chalk.blue(resource.method + ": " + resource.path));
            }
          });
      }
    });
    console.log(count);
  }
};

// function to list all resources in an element JSON
const listResources = (element) => {
  if (element.resources && (element.resources.length > 0)) {
    element.resources.forEach((resource) => {
      if (resource.path) {
          console.log(resource.method + ": " + resource.path);
      }
    });
  }
};

module.exports = {
  removeAmazon: removeAmazon,
  listParams: listParams,
  listResources: listResources
};
