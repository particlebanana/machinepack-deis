module.exports = {


  friendlyName: 'List processes',


  description: 'Lists processes servicing an application.',


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
    },

    app: {
      description: 'The uniquely identifiable name for the application.',
      example: 'myawesomeapp',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notAuthenticated: {
      description: 'The token provided was invalid'
    },

    success: {
      description: 'Returns the processes for the app and their status.',
      example: [{
        name: 'web',
        count: 2,
        state: 'up'
      }]
    },

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/apps/' + inputs.app + '/containers';

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

      var processes = [];
      var results = body.results || [];

      results.forEach(function(process) {
        processes.push({
          name: process.type,
          count: process.num,
          state: process.state
        });
      });

      return exits.success(processes);
    });

  }

};
