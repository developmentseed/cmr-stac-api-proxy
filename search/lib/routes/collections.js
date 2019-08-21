const _ = require('lodash');
const { adaptParams, generateAppUrl, wfs } = require('../util');
const cmr = require('../cmr/cmr');
const cmrConverter = require('../cmr/cmr_converter');

const wfsParamsToCmrParamsMap = {
  bbox: ['bounding_box', _.identity],
  time: ['temporal', _.identity],
  limit: ['page_size', _.identity]
};

const getCollections = async (request, response) => {
  const event = request.apiGateway.event;
  const params = adaptParams(wfsParamsToCmrParamsMap, event.queryStringParameters);
  const collections = await cmr.findCollections(params);
  return {
    links: [
      wfs.createLink('self', generateAppUrl(event, '/collections'), 'this document')
    ],
    collections: collections.map(coll => cmrConverter.cmrCollToWFSColl(event, coll))
  };
};

const getCollection = async (request, response) => {
  const event = request.apiGateway.event;
  const conceptId = request.params.collectionId;
  const coll = await cmr.getCollection(conceptId);
  if (coll) {
    return cmrConverter.cmrCollToWFSColl(event, coll);
  }
  return null;
};

const getGranules = async (request, response) => {
  const event = request.apiGateway.event;
  const conceptId = request.params.collectionId;
  const params = Object.assign({}, adaptParams(wfsParamsToCmrParamsMap, event.queryStringParameters), { collection_concept_id: conceptId });
  const granules = await cmr.findGranules(params);
  return {
    features: granules.map(gran => cmrConverter.cmrGranToFeatureGeoJSON(event, gran))
  };
};

const getGranule = async (request, response) => {
  const event = request.apiGateway.event;
  const collConceptId = request.params.collectionId;
  const conceptId = request.params.itemId;
  const granules = await cmr.findGranules({
    collection_concept_id: collConceptId,
    concept_id: conceptId
  });
  return cmrConverter.cmrGranToFeatureGeoJSON(event, granules[0]);
};

module.exports = {
  getCollections,
  getCollection,
  getGranules,
  getGranule
};
