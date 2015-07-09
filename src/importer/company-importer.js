module.exports = function(Promise, importerFactory) {

  function prepare(connexion) {
    return connexion.query('DELETE FROM company', { type: connexion.QueryTypes.DELETE })
      .then(function() {
        connexion.query('DELETE FROM company_custom_attributes', { type: connexion.QueryTypes.DELETE });
      });
  }
  
  function process(company) {
    var connexion = this.connection,
      query = this.query;

    return query('INSERT INTO company (id, company_id, name, created_at, updated_at, last_request_at, monthly_spend, session_count, user_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [company.id, company.company_id, company.name, company.created_at, company.updated_at, company.last_request_at, company.monthly_spend, company.session_count, company.user_count]
    }).then(function() {
      var promises = [];

      if (company.custom_attributes) {
        Object.keys(company.custom_attributes).forEach(function(key) {
          promises.push(query('INSERT INTO company_custom_attributes (company_id, name, value) VALUES (?, ?, ?)', {
            type: connexion.QueryTypes.INSERT,
            replacements: [company.id, key, company.custom_attributes[key]]
          }));
        });
      }

      return Promise.all(promises);
    });
  }
  
  return importerFactory.get('companies', prepare, process);
};
