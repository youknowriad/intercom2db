module.exports = function(dp) {
  return {
    get: function(label, prepare, process) {
      return {
        run: function(connexion, intercomConfig) {
          return prepare(connexion, intercomConfig).then(function() {
            return this.import(connexion, intercomConfig);
          }.bind(this));
        },

        import: function(connexion, intercomConfig) {
          var pump = new dp.Pump();

          return pump
            .mixin(dp.mixin.RestMixin)
            .fromRest({
              query: function(page) {
                page = page ? page : 1;
                console.log('Requesting ' + label + ' : page ' + page);
                return this.get('https://api.intercom.io/' + label + '?per_page=50&page=' + page, {
                  headers: {
                    Accept: 'application/json'
                  },
                  username: intercomConfig.appId,
                  password: intercomConfig.apiKey
                });
              },
              resultMapping: function(response) {
                return response.result[label];
              },
              nextPage: function(response) {
                return response.result.pages && response.result.pages.next ? response.result.pages.page + 1 : null;
              }
            })
            .mixin(require('../mixin/sequelize-mixin')(connexion))
            .process(process)
            .logErrorsToConsole()
            .start()
            .whenFinished().then(function() {
              console.log('Done updating ' + label);
            });
        }
      };
    }
  };
};
