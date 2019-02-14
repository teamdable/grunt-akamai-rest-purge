/*
 * grunt-akamai-rest-purge
 * https://github.com/hereandnow/grunt-akamai-rest-purge
 *
 * Copyright (c) 2014 Bastian Behrens
 * Licensed under the MIT license.
 */

'use strict';

const EdgeGrid = require('edgegrid');
const path = require('path');

const edgercPath = path.join(__dirname, "../.edgerc");
// The section of the .edgerc file to use for authentication
const sectionName = "default";
// Create a new instance of the EdgeGrid signing library
const eg = new EdgeGrid({
    path: edgercPath,
    section: sectionName,
    debug: false
});

function invalidate(objects_list, cb) {
    const purgeObj = {
      "hostname": "bc.akamaiapibootcamp.com",
      "objects": objects_list
    };
    console.info("Adding data to queue: " + JSON.stringify(purgeObj));

    eg.auth({
        path: "/ccu/v3/invalidate/url",
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: purgeObj
    });

    return eg.send(function(data, response) {
      data = JSON.parse(data);

      if (response.statusCode !== 201) {
        console.error('[AKAMAI_PURGE_HTTP_ERROR]', response.statusCode);
        return cb(response.statusCode, {body: response.body, data: data});
      }
      console.info('responseStatusCode', response.statusCode);
      console.info('responseBody', response.body);
      console.info("data: ", data);

      return cb(null, {body: response.body, data: data});
    });
}

var formatResponse = function (response) {
  return response.detail +
    ' - about ' +
    response.estimatedSeconds +
    ' seconds are needed to complete the purge request!'
};

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
          console.error('[AKAMAI_PURGE_ERROR]', err, data);
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
