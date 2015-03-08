module.exports = {


  friendlyName: 'Set config',


  description: 'Set environment variables for an app',


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
    },

    values: {
      description: 'An array of key/value pairs to set as environment config values.',
      example: [{
        key: 'DATABASE_URL',
        value: 'postgres://localhost:5432'
      }],
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
      description: 'Returns the currently set config values.',
      example: [{
        name: 'DATABASE_URL', value: 'postgres://localhost:5432'
      }]
    },

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

    var body = {
      app: inputs.app
    };

    var values = {};
    inputs.values.forEach(function(item) {
      values[item.key.toUpperCase()] = item.value;
    });

    // Attach the stringified values dictionary onto the body
    body.values = JSON.stringify(values);

    // Make the HTTP request
    request.post({ url: url, form: body, headers: headers, json: true }, function(err, response, body) {
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
