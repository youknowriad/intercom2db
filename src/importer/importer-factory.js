var dp = require('datapumps');
var Promise = require('bluebird');

module.exports = function(connexion, schema, intercomConfig) {
  return {
    get: function(label, detailed) {
      var Importer = require('./' + label + '-importer'),
        importer = new Importer(connexion, schema),
        run = function() {
          var pump = new dp.Pump();

          return pump
            .mixin(dp.mixin.RestMixin)
            .fromRest({
              query: function(page) {
                page = page ? page : 1;
                process.stdout.write('Requesting ' + label + ' : page ' + page + '\n');

                var promise = this.get('https://api.intercom.io/' + label + '?per_page=50&page=' + page, {
                  headers: {
                    Accept: 'application/json'
                  },
                  username: intercomConfig.appId,
                  password: intercomConfig.apiKey
                });

                if (detailed) {
                  var self = this;

                  promise = promise.then(function(response) {
                    var promises = [];

                    response.result[label].forEach(function(item) {
                      promises.push(self.get('https://api.intercom.io/' + label + '/' + item.id, {
                        headers: {
                          Accept: 'application/json'
                        },
                        username: intercomConfig.appId,
                        password: intercomConfig.apiKey
                      }));
                    });

                    return Promise.all(promises).then(function(items) {
                      response.result[label] = items.map(function(item) { return item.result; });

                      return response;
                    });
                  });
                }

                return promise;
              },
              resultMapping: function(response) {
                return response.result[label];
              },
              nextPage: function(response) {
                return response.result.pages && response.result.pages.next ? response.result.pages.page + 1 : null;
              }
            })
            .mixin(require('../mixin/sequelize-mixin')(connexion))
            .process(importer.process)
            .logErrorsToConsole()
            .start()
            .whenFinished().then(function() {
              process.stdout.write('Done updating ' + label + '\n');
            });
        };

      return {
        run: function() {
          return importer.prepare(connexion, schema).then(run);
        }
      };
    }
  };
};
