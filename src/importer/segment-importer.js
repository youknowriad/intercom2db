module.exports = function(Promise, importerFactory) {

  function prepare(connexion) {
    return new Promise(function(resolve, reject) {
      connexion.query('DELETE FROM segment', function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  
  function process(segment) {
    return this.query('INSERT INTO segment (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)', segment.id, segment.name, segment.created_at, segment.updated_at);
  }
  
  return importerFactory.get('segments', prepare, process);
};
