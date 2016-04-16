"use strict";
const request = require('request');
const http = require('http');
const url = require('url');
let PORT = process.env.PORT || 8000;

process.argv.forEach(function (arg) {
  if(arg.indexOf('--port=') === 0) {
    PORT = parseInt(arg.replace('--port=', ''), 10);
  }
});

http.createServer((req, response) => {
  let remoteURL = url.parse(req.url.substring(1));
  if(!remoteURL.hostname || remoteURL.hostname === 'localhost') return response.end();

  for(let key in req.headers) {
    if(key.match(/host|cookie/ig)){
      delete req.headers[key];
    }
  }

  let config = {
    url: remoteURL,
    followAllRedirects: true,
    method: req.method,
    headers: req.headers
  };

  if(req.method !== 'HEAD') {
    config.body = req;
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  
  request(config)
    .on('error', () => response.end())
    .pipe(response, {end:true});

}).listen(PORT);
