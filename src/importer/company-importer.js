module.exports = function(importerFactory) {

  function prepare(connexion) {
    return connexion.query('DELETE FROM company', { type: connexion.QueryTypes.DELETE });
  }
  
  function process(company) {
    var connexion = this.connection;

    return this.query('INSERT INTO company (id, company_id, name, created_at, updated_at, last_request_at, monthly_spend, session_count, user_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [company.id, company.company_id, company.name, company.created_at, company.updated_at, company.last_request_at, company.monthly_spend, company.session_count, company.user_count]
    });
  }
  
  return importerFactory.get('companies', prepare, process);
};
