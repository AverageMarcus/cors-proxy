"use strict";
const request = require('request');
const http = require('http');
const url = require('url');
const fs = require('fs').promises;
let PORT = process.env.PORT || 8000;

process.argv.forEach(function (arg) {
  if(arg.indexOf('--port=') === 0) {
    PORT = parseInt(arg.replace('--port=', ''), 10);
  }
});

http.createServer((req, response) => {
  if (!req.url.substring(1)) {
    return loadWebpage(req, response);
  }

  let remoteURL = url.parse(req.url.substring(1));
  if(!remoteURL.hostname || remoteURL.hostname === 'localhost') return response.end();

  if(req.method === 'OPTIONS') {
    response.writeHead(200, {
      'access-control-allow-origin': req.headers.origin || '*',
      'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, authorization'
    });
    return response.end();
  }

  for(let key in req.headers) {
    if(key.match(/host|cookie/ig)){
      delete req.headers[key];
    }
  }

  let config = {
    url: remoteURL,
    followAllRedirects: true,
    method: req.method,
    headers: req.headers,
    gzip: true
  };

  if(req.method !== 'HEAD') {
    config.body = req;
  }

  request(config)
    .on('response', res => {
      res.headers['access-control-allow-origin'] = req.headers.origin || '*';
      res.headers['access-control-allow-headers'] = 'Origin, X-Requested-With, Content-Type, Accept, authorization';
      delete res.headers['access-control-allow-credentials'];
      delete res.headers['access-control-allow-methods'];
      delete res.headers['content-encoding'];
      delete res.headers['content-length'];
      delete res.headers['x-frame-options'];
      response.writeHead(res.statusCode, res.headers);
    })
    .on('data', function(data) {
      response.write(data);
    })
    .on('error', () => response.end())
    .on('end', () => response.end());

}).listen(PORT);

function loadWebpage(req, res) {
  fs.readFile(__dirname + "/index.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });
}
