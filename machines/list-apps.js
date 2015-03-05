module.exports = {


  friendlyName: 'List apps',


  description: 'Lists applications visible to the current user.',


  extendedDescription: '',


  inputs: {

    token: {
      description: 'An access token for use with a Deis install.',
      example: '',
      required: true
    },

    controller: {
      description: 'The controller location of your Deis install.',
      example: 'http://deis.mydeisapp.com',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notAuthenticated: {
      description: 'The token provided were invalid'
    },

    success: {
      description: 'Returns a list of applications',
      example: [{
        uuid: '12ef4f97-8669-4337-befa-288a5e0e8ac8',
        id: 'foobar',
        url: 'foobar.mydeisapp.com',
        created: '2015-03-05T07:43:17UTC',
        updated: '2015-03-05T07:43:17UTC'
      }]
    },

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/apps';
    var headers = {
      'content-type': 'application/json',
      'X-Deis-Version': 1,
      'Authorization': 'token ' + inputs.token
    };

    // Make the HTTP request
    request.get({ url: url, headers: headers, json: true }, function(err, response, body) {
      if(err) return exits.error();

      var code = response.statusCode;
      if(!code) return exits.error();
      if(code > 499) return exits.error();
      if(code > 299) return exits.notAuthenticated();

      var apps = body.results || [];
      return exits.success(apps);
    });

  }

};
