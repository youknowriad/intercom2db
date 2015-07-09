var dp = require('datapumps');
var Promise = require('bluebird');
var importerFactory = require('./importer/importer-factory')(dp);
var userImporter = require('./importer/user-importer')(Promise, importerFactory);
var companyImporter = require('./importer/company-importer')(importerFactory);
var tagImporter = require('./importer/tag-importer')(importerFactory);
var segmentImporter = require('./importer/segment-importer')(importerFactory);
var schemaCreator = require('./database/schema-create');

module.exports = {
  run: function(config) {
    var Sequelize = require('sequelize');
    var intercomConfig = config.intercom;

    var connexion = new Sequelize(config.database.database, config.database.user ,  config.database.password, {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      logging: false
    });

    return schemaCreator.create(connexion)
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
      .catch(console.error);
  }
};
