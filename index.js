"use strict";

const moment = require("moment");
// const cehandler = require('cloudelements-cehandler');
const cehandler = require('../lambdax');
const fs = require('fs');
// const inquirer = require('inquirer');
const chalk = require('chalk');
const readWrite = require('./src/read-write');
const removeAmazon = readWrite.removeAmazon;
const listParams = readWrite.listParams;
const listResources = readWrite.listResources;
const validate = require('./src/validate');

// store only the arguments after "node index.js"
const args = process.argv.slice(2);

const getElement = (path) => {
    return require(path);
};

const getRequestBody = (fileNamePath, next) => {
    if (fs.existsSync(fileNamePath)) {
        fs.readFile(fileNamePath, 'utf8', (err, data) => {
            if (err) throw err;
            next(JSON.parse(data));
        });
    } else { // can't find file, bail
        console.log("please provide a valid file path for a request object");
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
    });
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
    console.log(chalk.yellow('    node index.js list-resources /path/to/element.json'));
    console.log(chalk.yellow('    node index.js make-req /path/to/element.json ./requests/{element}/{request-file}.json'));
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
} else if (args.indexOf('rm-amazon') === 0) { // strip aws properties
    let swagger = getElement(args[1]);
    let fileName = args[1].split('/')[args[1].split('/').length - 1];
    removeAmazon(swagger, fileName);
} else if (args.indexOf('validate-hooks') === 0) {
    let element = getElement(args[1]);
    validate.hooks(element);
} else if (args.indexOf('validate-params') === 0) {
    let element = getElement(args[1]);
    validate.params(element);
} else if (args.indexOf('make-req-s3') === 0) {
    // check for both path to element and requestBody name
    if (args.length >= 3) {
        let element = getElement(args[1]);
        getRequestBody(args[2], (requestBody) => {
            let time = moment().format()
                .split('').filter((char) => {
                    return char !== '-' && char !== ':';
                });
            //let amzTime = time.join('').substring(0, time.length - 4) + "Z";
            let amzTime = time.join('').substring(0, time.length - 5) + "Z";
            //20170317T153540Z
            console.log(amzTime);
            requestBody.headers["x-amz-date"] = amzTime;
            makeRequest(element, requestBody);
        });
    }
} else {
    console.log(args[0] + ' is not currently a supported command');
    console.log('try list or requests');
}