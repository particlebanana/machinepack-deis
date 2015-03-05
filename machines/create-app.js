module.exports = {


  friendlyName: 'Create app',


  description: 'Creates a new application.',


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

    id: {
      description: 'A name for the application',
      example: 'myawesomeapp'
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
      description: 'Returns the newly created application.',
      example: {
        uuid: 'd6e93995-1bee-49b1-a80a-d3eeef95ffdc',
        id: 'ironic-neckwear',
        url: 'ironic-neckwear.mydeiaapp.com',
        created: '2015-03-05T17:22:59UTC',
        updated: '2015-03-05T17:22:59UTC'
      }
    },

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/apps/';

    var headers = {
      'content-type': 'application/json',
      'X-Deis-Version': 1,
      'Authorization': 'token ' + inputs.token
    };

    var body = {};
    if(inputs.id) body.id = inputs.id;

    // Make the HTTP request
    request.post({ url: url, form: body, headers: headers, json: true }, function(err, response, body) {
      if(err) return exits.error();

      var code = response.statusCode;
      if(!code) return exits.error();
      if(code > 499) return exits.error();
      if(code > 299) return exits.notAuthenticated();
      return exits.success(body);
    });

  }

};
