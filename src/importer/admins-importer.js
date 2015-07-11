var Promise = require('bluebird');

module.exports = function(connexion, schema) {
  var table = schema.toSQL() + 'users';

  this.prepare = function() {
    return Promise.resolve([]);
  };

  this.process = function(user) {
    return connexion.query('INSERT INTO ' + table + '(id, name, email) VALUES (?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [user.id, user.name, user.email]
    });
  };
};

