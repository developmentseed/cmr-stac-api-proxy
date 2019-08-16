const _ = require('lodash');

const { makeRawResponse, generateAppUrl, wfs } = require('../util');
const collections = require('./collections');
const stac = require('./stac');

const getRoot = async (request, response) => {
  const event = request.apiGateway.event;
  const accept = _.get(event, 'headers.Accept', 'application/json');
  if (accept.includes('html')) {
    // Redirect root application to /docs/index.html
    return makeRawResponse({
      statusCode: 302,
      headers: {
        Location: generateAppUrl(event, '/docs/index.html')
      },
      body: 'Redirecting...'
    });
  }
  // else return JSON.
  return {
    links: [
      wfs.createLink('self', generateAppUrl(event, ''), 'this document'),
      wfs.createLink('conformance', generateAppUrl(event, '/conformance'),
        'WFS 3.0 conformance classes implemented by this server'),
      wfs.createLink('data', generateAppUrl(event, '/collections'),
        'Metadata about the feature collections')
    ]
  };
};

const getConformance = async (request, response) => {
  return {
    conformsTo: [
      'http://www.opengis.net/spec/wfs-1/3.0/req/core',
      'http://www.opengis.net/spec/wfs-1/3.0/req/oas30',
      'http://www.opengis.net/spec/wfs-1/3.0/req/html',
      'http://www.opengis.net/spec/wfs-1/3.0/req/geojson'
    ]
  };
};

module.exports = {
  getRoot,
  getConformance,
  collections,
  stac
};