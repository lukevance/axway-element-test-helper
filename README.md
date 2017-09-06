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

To make a request to one of the supported resources in the element.json, create a request body file - this file can be located anywhere on the file system, but it's recommended to be placed in the `requests` directory under the name of the api, in the format of `method-resource.json` where `resource` is a dash-separated resource, ex. a GET to /contacts/{id} would be `get-contacts-id.json`.

Then use the below command to execute the request:

```bash
$ node index make-request /path/to/element.json /path/to/request-body.json
```

Examples:

```bash
$ node index.js make-req /path/to/element.json requests/zendesk/get-contacts.json
```
The result of your call will be logged in the terminal.


REMOVE AMAYZ
Examples:

```bash
$ node index.js rm-amazon /path/to/swagger.json
```
That shiz is fixed now
