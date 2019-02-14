/*
 * grunt-akamai-rest-purge
 * https://github.com/hereandnow/grunt-akamai-rest-purge
 *
 * Copyright (c) 2014 Bastian Behrens
 * Licensed under the MIT license.
 */

'use strict';

const { purge } = require('akamai');
// The section of the .edgerc file to use for authentication
// Create a new instance of the EdgeGrid signing library

function invalidate(objects_list, cb) {
  return purge(objects_list)
  .then((result) => {
    console.info(`[INVLIDATE_AKAMAI_SUCCESS] - at:${new Date()}, result:${result}`);
    return cb(null, result);
  })
  .catch((err) => {
    console.error(`[INVALIDATE_AKAMAI_ERROR] - at:${new Date()}`, err);
    return cb(err);
  });
}

module.exports = function(grunt) {

  grunt.registerMultiTask('akamai_rest_purge', 'Purging Akamai via their Rest Interface', function() {
    var done = this.async();
    let actionName = this.options.action;
    if (!actionName) {
      actionName = 'invalidate';
    }
  
    if (actionName === 'invalidate') {
      console.info(`[BEGIN_INVALIDATE] - at:${new Date()}`);
      return invalidate(this.data.objects, (err, data) => {
        if (err) {
          console.error('[AKAMAI_PURGE_ERROR]', err);
          return grunt.log.errorlns(err);
        }

        console.info('[DONE_AKAMAI_PURGE]', data);
        grunt.log.ok(JSON.stringify(data));
        done();
      });
    } else {
      return done(new Error(`[INVALID_ACTION] - options:${JSON.stringify(optoins)}`));
    }
  });

};
