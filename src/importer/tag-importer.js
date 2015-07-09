module.exports = function(importerFactory) {
  function prepare(connexion) {
    return connexion.query('DELETE FROM tag', { type: connexion.QueryTypes.DELETE });
  }
  
  function process(tag) {
    var connexion = this.connection;

    return this.query('INSERT INTO tag (id, name) VALUES (?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [tag.id, tag.name]
    });
  }
  
  return importerFactory.get('tags', prepare, process);
};
