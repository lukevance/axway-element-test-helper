"use strict";

const cehandler = require('cloudelements-cehandler');
const fs = require('fs');
// const inquirer = require('inquirer');
const chalk = require('chalk');
const readWrite = require('./src/read-write');
const removeAmazon = readWrite.removeAmazon;
const listParams = readWrite.listParams;
const listResources = readWrite.listResources;
const validate = require('./src/validate');
const validateHooks = validate.hooks;

// store only the arguments after "node index.js"
const args = process.argv.slice(2);

const getElement = (path) => {
  return require(path);
};

const getRequestBody = (fileNamePath, next) => {
  console.log(fileNamePath);
  if (fileNamePath){
    // attach json if necessary
    if (fileNamePath.indexOf('.json') === -1) {
      fileNamePath = fileNamePath + '.json';
    }
    // check if it's a path or just name
    if (fileNamePath.indexOf('/') < 0) {
      // check /requests for given fileName
      fs.readdir('./requests', (err, files) => {
        if (err) {throw err;}
        if (files.indexOf(fileNamePath) >= 0){
          let body = require('./requests/' + fileNamePath);
          next(body);
        } else {
          console.log('Request body file not found.');
        }
      });
    // filenName includes path, check for request name in path
    } else if ((fileNamePath.split('/')[0].length > 1) && (fileNamePath.split('/')[1].length > 1)) {
      let subdir = fileNamePath.split('/')[0];
      let fileName = fileNamePath.split('/')[1];
      // check /requests for subdir
      fs.readdir('./requests', (err, files) => {
        if (err) {throw err;}
        if (files.indexOf(subdir) >= 0){
          // check subDir for fileName
          fs.readdir('./requests/' + subdir, (err, subFiles) => {
            if (err) {throw err;}
            if (subFiles.indexOf(fileName) >= 0) {
              let body = require('./requests/' + fileNamePath);
              next(body);
            } else {
              console.log('Request body file ' + fileNamePath + ' not found.');
            }
          });
        } else {
          console.log('Directory ' + subdir + ' not found.');
        }
      });
    } else {
      console.log("please provide the name of subdirectory of requests and a valid request object name");
    }
  } else {
    console.log("please provide a valid request object name or path");
  }
};

const executeCall = (element, request_data) => {
  return cehandler.handler(element)(request_data, {
      requestId: 'fake-run-request',
      succeed: o => {
        // console.log('done');
        console.log(JSON.stringify(o, null, 2));
      },
      fail: o => console.warn('failure', typeof(o), o),
      done: (err, o) => {
        if (err != null) { console.warn('error', typeof(err), err); }
        if (o != null) { console.log(o); }
      }
    }
  );
};

// The function that handles the request and logs the response
const makeRequest = (element, request) => {
  if (element && request) {
    executeCall(element, request);
  } else {
    console.log("please provide a valid element and request body");
  }

};

if (args.length < 1) {
  console.log(chalk.red('ERROR: please provide a command'));
  console.log();
  console.log(chalk.yellow('commands: ') + chalk.blue('list-resources') + chalk.yellow(' | ') + chalk.blue('make-req'));
  console.log(chalk.yellow('    example:'));
  console.log(chalk.yellow('    node index.js list /path/to/element.json'));
} else if (args.length < 2) {
  console.log(chalk.red('ERROR: please provide an element path'));
  console.log();
  console.log(chalk.yellow('    example:'));
  console.log(chalk.yellow('    node index.js make-req /path/to/element.json'));
} else if (args.indexOf('list-resources') === 0) {
  console.log('list resources');
  let element = getElement(args[1]);
  listResources(element);
} else if (args.indexOf('list-params') === 0) {
  console.log('list params');
  let element = getElement(args[1]);
  listParams(element);
} else if (args.indexOf('make-req') === 0) {
  // check for both path to element and requestBody name
  if (args.length >= 3) {
    let element = getElement(args[1]);
    getRequestBody(args[2], (requestBody) => {
      makeRequest(element, requestBody);
    });
  } else {
    console.log('please include a request object and an element.json file');
  }
} else if (args.indexOf('rm-prop') === 0) {
  let swagger = getElement(args[1]);
  removeAmazon(swagger, args[2]);
} else if (args.indexOf('validate-hooks') === 0) {
  let element = getElement(args[1]);
  validateHooks(element);
} else {
  console.log(args[0] + ' is not currently a supported command');
  console.log('try list or requests');
}
