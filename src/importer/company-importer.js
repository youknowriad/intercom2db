module.exports = function(Promise, importerFactory) {

  function prepare(connexion) {
    return new Promise(function(resolve, reject) {
      connexion.query('DELETE FROM company', function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  
  function process(company) {
    return this.query('INSERT INTO company (id, company_id, name, created_at, updated_at, monthly_spend, session_count, user_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', company.id, company.company_id, company.name, company.created_at, company.updated_at, company.last_request_at, company.monthly_spend, company.session_count, company.user_count);
  }
  
  return importerFactory.get('companies', prepare, process);
};
