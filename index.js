"use strict";

const cehandler = require('cloudelements-cehandler');
const element = require('../../elements-bazaar/native/HubSpot.json');
const chalk = require('chalk');

// store only the arguments after "node index.js"
const args = process.argv.slice(2);

// Template for Request Data to be passed into the cehandler
const request_data = {
  "headers": {
    "x-vendor-authorization": "Bearer sampleVendorAuthToken", //This header must be what the vendor expects not Cloud Elements apis
  },
  "paths": {
    // "id": "12345"
  },
  "operation": {
    "method": "DELETE",
    "path": "/hubs/native/campaigns"
  },
  "queryParameters": {
    // "fields": "Id,Website,AccountNumber"
  },
  "body": {} // only used in POST/PATCH
};

// The function that handles the request and logs the response
const makeRequest = () => {
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

// function to list all resources in an element JSON
const listResources = () => {
  if (element.resources && (element.resources.length > 0)) {
    element.resources.forEach((resource) => {
      if (resource.path){
          console.log(resource.method + ": " + resource.path);
      }
    });
  }
};

if (args.length < 1) {
  console.log(chalk.red('ERROR: please provide a command'));
  console.log();
  console.log(chalk.yellow('commands: ') + chalk.blue('list') + chalk.yellow(' OR ') + chalk.blue('request'));
  console.log(chalk.yellow('    example:'));
  console.log(chalk.yellow('    node index.js list /path/to/element.json'));
} else if (args.length < 2) {
  console.log(chalk.red('ERROR: please provide an element path'));
  console.log();
  console.log(chalk.yellow('    example:'));
  console.log(chalk.yellow('    node index.js request /path/to/element.json'));
} else if (args.indexOf('list') === 0) {
  console.log('list resources');
  listResources();
} else if (args.indexOf('request') === 0) {
  console.log('make a request');
  makeRequest();
} else {
  console.log(args[0] + ' is not currently a supported command');
  console.log('try list or requests');
}
