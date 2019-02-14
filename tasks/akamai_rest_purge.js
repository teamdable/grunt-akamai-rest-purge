/*
 * grunt-akamai-rest-purge
 * https://github.com/hereandnow/grunt-akamai-rest-purge
 *
 * Copyright (c) 2014 Bastian Behrens
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');

var formatResponse = function (response) {
  return response.detail +
    ' - about ' +
    response.estimatedSeconds +
    ' seconds are needed to complete the purge request!'
};

module.exports = function(grunt) {

  grunt.registerMultiTask('akamai_rest_purge', 'Purging Akamai via their Rest Interface', function() {

    var done = this.async();

    var options = this.options({
      method: 'post',
    });

    if (!options.action) {
      options.action = 'invalidate';
    }

    if (options.action === 'invalidate') {
      const network = options.network ? options.network : 'production';
      options.url = `https://api.ccu.akamai.com//ccu/v3/invalidate/url/${network}`;
    } else {
      return done(new Error(`[INVALID_ACTION] - options:${JSON.stringify(optoins)}`));
    }

    options.json.objects = this.data.objects;

    request(options, function (err, response) {
      if (err) {
        return grunt.log.errorlns(err.message);
      }
      if (response.statusCode !== 201) {
        return grunt.log.errorlns(response.body.detail || response.body);
      }
      grunt.log.ok(formatResponse(response.body));
      done();
    });

  });

};
