module.exports = function(importerFactory) {

  function prepare(connexion) {
    return connexion.query('DELETE FROM segment', { type: connexion.QueryTypes.DELETE });
  }
  
  function process(segment) {
    var connexion = this.connection;

    return this.query('INSERT INTO segment (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [segment.id, segment.name, segment.created_at, segment.updated_at]
    });
  }
  
  return importerFactory.get('segments', prepare, process);
};
