module.exports = {


  friendlyName: 'Unset config',


  description: 'Unsets an environment variable for an application.',


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

    key: {
      description: 'An the config key to remove.',
      example: 'DATABASE_URL',
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
      description: 'Successfully removed the environment config',
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
    values[inputs.key.toUpperCase()] = null;

    // Attach the stringified values dictionary onto the body
    body.values = JSON.stringify(values);

    // Make the HTTP request
    request.post({ url: url, form: body, headers: headers, json: true }, function(err, response, body) {
      if(err) return exits.error();

      var code = response.statusCode;
      if(!code) return exits.error();
      if(code > 499) return exits.error();
      if(code > 299) return exits.notAuthenticated();
      return exits.success();
    });

  }

};