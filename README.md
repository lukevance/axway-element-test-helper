# Native Element Testing Helper
A tool to help manually test element.json files with the cloudelements-cehandler.

## Overview
A very simple app to help in reading element.json files and then make requests to element endpoints via the cloudelements-cehandler package.
> __Note:__ Although this repo is public, it relies on `cloudelements-cehandler` which is a private Cloud Elements package.

## Installation
If you don't have `node` and `npm` installed, do [that](https://docs.npmjs.com/getting-started/installing-node) first.

> __PROTIP:__ `node` version must  be >= `v4.0.0`

Install the node dependencies.

```bash
# Navigate to this directory
$ cd /path/to/axway-element-test-helper

# Install all necessary npm packages:
$ npm install
```

## Usage
To simply list all resources of an element.json file use the following command:
```bash
$ node index.js list-resources /path/to/element.json
```

To make a request to one of the supported resources in the element.json file first create a relevant request in the `/requests` directory. A template request body exists there. Be sure to acquire an authorization header for the service that you are planning to make a request to and add the header to the request body file in the `/requests` directory.

Then use the below command to execute the request.
```bash
$ node index.js make-req /path/to/element.json requestBodyFileName
```
The result of your call will be logged in the terminal.
