module.exports = {


  friendlyName: 'Set limit',


  description: 'Sets resource limits for an application.',


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

    limit: {
      description: 'Which resource limit will be set. Defaults to memory.',
      example: 'memory'
    },

    value: {
      description: 'The value to set for the limit. With memory, units are represented in Bytes (B), Kilobytes (K), Megabytes(M), or Gigabytes (G). e.g. "1G". With cpu, units are represented in the number of cpu shares. e.g. 1024.',
      example: '512M',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    invalidLimit: {
      description: 'The value supplied for `limit` is invalid. It must be either cpu or memory.'
    },

    notAuthenticated: {
      description: 'The token provided was invalid'
    },

    success: {
      description: 'Successfully set limits.',
      example: {
        memory: '512M',
        cpu: 'unlimited'
      }
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

    var target = inputs.limit || 'memory';
    if(['memory', 'cpu'].indexOf(target) < 0) {
      setImmediate(function() {
        exits.invalidLimit();
      });
      return;
    }

    var body = {
      app: inputs.app
    };

    var values = {};
    values[target] = inputs.value;

    body[target] = JSON.stringify(values);

    // Make the HTTP request
    request.post({ url: url, form: body, headers: headers, json: true }, function(err, response, body) {
      if(err) return exits.error();

      var code = response.statusCode;
      if(!code) return exits.error();

      if(code > 499) return exits.error();
      if(code > 299) return exits.notAuthenticated();

      var values = {};
      values.memory = body.memory && body.memory.memory || 'unlimited';
      values.cpu = body.cpu && body.cpu.cpu || 'unlimited';

      return exits.success(values);
    });

  }

};
