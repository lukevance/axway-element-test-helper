"use strict";

const cehandler = require('cloudelements-cehandler');
const fs = require('fs');
// const inquirer = require('inquirer');
const chalk = require('chalk');
// store only the arguments after "node index.js"
const args = process.argv.slice(2);

const getElement = (path) => {
  return require(path);
};

const executeCall = (element, request_data) => {
  return cehandler.handler(element)(request_data, {
      requestId: 'fake-run-request',
      succeed: o => console.log(JSON.stringify(o, null, 2)),
      fail: o => console.warn('failure', typeof(o), o),
      done: (err, o) => {
        if (err != null) { console.warn('error', typeof(err), err); }
        if (o != null) { console.log(o); }
      }
    }
  );
};

const buildRequest = (args) => {
  if (args.length > 1) {
    //do something
  }
};

// The function that handles the request and logs the response
const makeRequest = (element, request) => {
  if (request) {
    if (request.indexOf('.json') === -1) {
      request = request + '.json';
    }
    fs.readdir('./requests', (err, files) => {
      if (err) throw err;
      if (files.indexOf(request) >= 0){
        let request_body = require('./requests/' + request);
        executeCall(element, request_body);
      }
    });
  } else {
    console.log("please provide the name of a request object in the '/requests' directory");
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

if (args.length < 1) {
  console.log(chalk.red('ERROR: please provide a command'));
  console.log();
  console.log(chalk.yellow('commands: ') + chalk.blue('list-resources') + chalk.yellow(' | ') + chalk.blue('new-req') + chalk.blue('make-req'));
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
} else if (args.indexOf('make-req') === 0) {
  // check for both path to element and requestBody name
  if (args.length >= 3) {
    let element = getElement(args[1]);
    let requestBody = args[2];
    makeRequest(element, requestBody);
  } else {
    console.log('please include a request object and an element.json file');
  }
} else if (args.indexOf('new-request') === 0) {
  console.log('build a request object');
  buildRequest(args[1]);
} else {
  console.log(args[0] + ' is not currently a supported command');
  console.log('try list or requests');
}
