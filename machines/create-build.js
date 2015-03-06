module.exports = {


  friendlyName: 'Create build',


  description: 'Creates a new build of an application.',


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

    image: {
      description: 'A fully-qualified docker image, either from Docker Hub or from an in-house registry.',
      example: 'deis/example-go',
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
      description: 'Returns the newly created application.',
      example: {
        app: 'mydeisapp',
        image: 'deis/example-go',
        created: '2015-03-06T01:54:33UTC',
        updated: '2015-03-06T01:54:33UTC',
        uuid: 'b10741ba-6284-4231-8af8-528d5122420c'
      }
    }

  },


  fn: function (inputs,exits) {

    // Dependencies
    var request = require('request');

    var url = inputs.controller + '/v1/apps/' + inputs.app + '/builds';

    var headers = {
      'content-type': 'application/json',
      'X-Deis-Version': 1,
      'Authorization': 'token ' + inputs.token
    };

    var body = {
      app: inputs.app,
      image: inputs.image
    };

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
