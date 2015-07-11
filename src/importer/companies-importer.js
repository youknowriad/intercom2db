var Promise = require('bluebird');

module.exports = function(connexion, schema) {
  var companiesTable = schema.toSQL() + 'company';
  var companiesAttributesTable = schema.toSQL() + 'company_custom_attributes';

  this.prepare = function() {
    return connexion.query('DELETE FROM ' + companiesTable, { type: connexion.QueryTypes.DELETE });
  };
  
  this.process = function(company) {
    return connexion.query('INSERT INTO ' + companiesTable + '(id, company_id, name, created_at, updated_at, last_request_at, monthly_spend, session_count, user_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [company.id, company.company_id, company.name, company.created_at, company.updated_at, company.last_request_at, company.monthly_spend, company.session_count, company.user_count]
    }).then(function() {
      var promises = [];

      if (company.custom_attributes) {
        Object.keys(company.custom_attributes).forEach(function(key) {
          promises.push(connexion.query('INSERT INTO ' + companiesAttributesTable + '(company_id, name, value) VALUES (?, ?, ?)', {
            type: connexion.QueryTypes.INSERT,
            replacements: [company.id, key, company.custom_attributes[key]]
          }));
        });
      }

      return Promise.all(promises);
    });
  };
};
