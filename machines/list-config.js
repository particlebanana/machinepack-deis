module.exports = {


  friendlyName: 'List config',


  description: 'Lists environment variables for an application.',


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
      description: 'Successfully set limits.',
      example: [{
        name: 'DATABASE_URL', value: 'postgres://localhost:5432'
      }]
    }

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/apps/' + inputs.app + '/config';

    var headers = {
      'content-type': 'application/json',
      'X-Deis-Version': 1,
      'Authorization': 'token ' + inputs.token
    };

    // Make the HTTP request
    request.get({ url: url, headers: headers, json: true }, function(err, response, body) {
      if(err) return exits.error(err);

      var code = response.statusCode;
      if(!code) return exits.error(new Error('Missing status code'));

      if(code > 499) return exits.error(code);
      if(code > 299) return exits.notAuthenticated();

      var values = Object.keys(body.values || {}).map(function(key) {
        return { name: key, value: body.values[key] };
      });

      return exits.success(values);
    });

  }

};
