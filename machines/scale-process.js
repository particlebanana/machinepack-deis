module.exports = {


  friendlyName: 'Scale process',


  description: 'Scales an application\'s processes by type.',


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

    process: {
      description: 'The name of the process to scale.',
      example: 'web',
      required: true
    },

    number: {
      description: 'The number of containers to scale to.',
      example: 1,
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
      description: 'Successfully scaled the process.',
    },

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/apps/' + inputs.app + '/scale';

    var headers = {
      'content-type': 'application/json',
      'X-Deis-Version': 1,
      'Authorization': 'token ' + inputs.token
    };

    var body = {};
    body[inputs.process] = inputs.number;

    // Make the HTTP request
    request.post({ url: url, form: body, headers: headers, json: true }, function(err, response, body) {
      if(err) return exits.error(err);

      var code = response.statusCode;
      if(!code) return exits.error(new Error('Missing status code'));

      if(code > 499) return exits.error(code);
      if(code > 299) return exits.notAuthenticated();

      return exits.success();
    });

  }

};
