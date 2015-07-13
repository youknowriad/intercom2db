var Promise = require('bluebird');
var dp = require('datapumps');
var schemaCreator = require('./database/schema-create')(Promise);
var sequelizeMixin = require('./mixin/sequelize-mixin');

module.exports = {
  run: function(config) {
    var Sequelize = require('sequelize');
    var intercomConfig = config.intercom;

    var connexion = new Sequelize(config.database.database, config.database.user ,  config.database.password, {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      logging: config.debug
    });

    var schema = {
      name: config.database.schema || '',
      toSQL: function() {
        return config.database.schema ? config.database.schema + '.' : '';
      }
    };

    var importerFactory = require('./importer/importer-factory')(dp, sequelizeMixin, Promise, connexion, schema, intercomConfig);

    return schemaCreator.create(connexion, schema)
      .then(importerFactory.get('tags').run)
      .then(importerFactory.get('segments').run)
      .then(importerFactory.get('companies').run)
      .then(importerFactory.get('users').run)
      .then(importerFactory.get('admins').run)
      .then(importerFactory.get('conversations', true).run)
      .catch(function() {
        process.stderr.write([].slice.call(arguments).join('\n') +  '\n');
      });
  }
};
