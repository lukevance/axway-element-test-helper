"use strict";

const cehandler = require('cloudelements-cehandler');
const element = require('../../elements-bazaar/native/HubSpot.json');
const chalk = require('chalk');

const args = process.argv.slice(2);

console.log(args);

// const request_data = {
//   "headers": {
//     "x-vendor-authorization": "Bearer sampleVendorAuthToken", //This header must be what the vendor expects not Cloud Elements apis
//   },
//   "paths": {
//     // "id": "12345"
//   },
//   "operation": {
//     "method": "DELETE",
//     "path": "/hubs/native/campaigns"
//   },
//   "queryParameters": {
//     // "fields": "Id,Website,AccountNumber"
//   },
//   "body": {} // only used in POST/PATCH
// };
//
// cehandler.handler(element)(request_data, {
//     requestId: 'fake-run-request',
//     succeed: o => console.log(JSON.stringify(o, null, 2)),
//     fail: o => console.warn('failure', typeof(o), o),
//     done: (err, o) => {
//       if (err != null) { console.warn('error', typeof(err), err); }
//       if (o != null) { console.log(o); }
//     }
//   }
// );
