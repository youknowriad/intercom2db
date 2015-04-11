var dp = require('datapumps');
var Promise = require('bluebird');
var importerFactory = require('./importer/importer-factory')(dp, Promise);
var userImporter = require('./importer/user-importer')(Promise, importerFactory);
var companyImporter = require('./importer/company-importer')(Promise, importerFactory);
var tagImporter = require('./importer/tag-importer')(Promise, importerFactory);
var segmentImporter = require('./importer/segment-importer')(Promise, importerFactory);
var schemaCreator = require('./database/schema-create')(Promise);

module.exports = {
  run: function(config) {
    var connexion = module.exports = require('mysql').createConnection(config.database);
    var intercomConfig = config.intercom;
    schemaCreator.create(connexion)
      .then(function() {
        return tagImporter.run(connexion, intercomConfig);
      })
      .then(function() {
        return segmentImporter.run(connexion, intercomConfig);
      })
      .then(function() {
        return companyImporter.run(connexion, intercomConfig);
      })
      .then(function() {
        return userImporter.run(connexion, intercomConfig);
      })
      .then(function() {
        connexion.end();
      })
      .catch(console.log());
  }
};
