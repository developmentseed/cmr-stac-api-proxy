const _ = require('lodash');
const fs = require('fs');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const swaggerFileContents = fs.readFileSync('docs/WFS3core+STAC.yaml');
const swagger = yaml.safeLoad(swaggerFileContents);

const createSchemaValidator = (schemaElement) => {
  // TODO: remove lodash
  const schema = Object.assign({}, {components: swagger.components}, swagger.components.schemas[schemaElement])
  return ajv.compile(schema);
};

module.exports = {
  createSchemaValidator
};
