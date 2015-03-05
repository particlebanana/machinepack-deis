module.exports = {


  friendlyName: 'Login',


  description: 'Logs in by authenticating against a controller.',


  extendedDescription: '',


  inputs: {

    controller: {
      description: 'The controller location of your Deis install.',
      example: 'http://deis.mydeisapp.com',
      required: true
    },

    username: {
      description: 'The username to use for login',
      example: 'foobar',
      required: true
    },

    password: {
      description: 'The password to use for login',
      example: 'deisrocks',
      required: true
    },

    sslVerify: {
      description: 'disables SSL certificate verification for API requests',
      defaultsTo: false,
      example: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    notAuthenticated: {
      description: 'The credentials provided were invalid'
    },

    success: {
      description: 'Returns an access token that can be used to access the Deis api',
      example: 'f128sh6736dna97ehsh83ejcess3r434'
    },

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/auth/login/';
    var body = {
      username: inputs.username,
      password: inputs.password,
      sslVerify: inputs.sslVerify || false
    };

    // Make the HTTP request
    request.post({ url: url, form: body, json: true }, function(err, response, body) {
      if(err) return exits.error();

      var code = response.statusCode;
      if(!code) return exits.error();
      if(code > 299) return exits.notAuthenticated();

      var token = body.token;
      if(!token) return exits.notAuthenticated();

      return exits.success(token);
    });

  }

};
