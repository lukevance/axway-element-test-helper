"use strict";

const _ = require('lodash');

const checkHooks = (element) => {
  console.log(`Validating the ${element.name} element.json file`);

  const isNotEmpty = arr => !_.isEmpty(arr);

  element.resources.forEach(resource => {
    if(isNotEmpty(resource.hooks)) {
      const statements = [];

      const preRequestHooks = resource.hooks.filter( hook => {
        return hook.type === 'preRequest'
      });

      const postRequestHooks = resource.hooks.filter( hook => {
        return hook.type !== 'preRequest'
      });

      if(isNotEmpty(preRequestHooks)) {
        if(preRequestHooks.length <= 1) {
          const preHook = preRequestHooks[0];

          const missingPreType = preHook.isLegacy ? 'grover' : 'legacy';

          statements.push(`- missing: ${resource.method} ${missingPreType} preRequestHook `);
        }
      }

      if(isNotEmpty(postRequestHooks)) {
        if(postRequestHooks.length <= 1) {

          const postHook = postRequestHooks[0];
          const missingPostType = postHook.isLegacy ? 'grover' : 'legacy';

          statements.push(`- missing ${resource.method} ${missingPostType} postRequestHook `);
        }
      }

      if(isNotEmpty(statements)) {
        console.warn(`Resource: ${resource.path} `);
        statements.forEach( statement => {
          console.log(statement);
        });
        console.log('\n')
      } else {
        console.log('All fields with hooks contain both legacy and grover hooks')
      }
    } else {
      console.log(`No hooks found for resource ${resource.method} ${resource.path}`)
    }
  });
};

module.exports = checkHooks;
