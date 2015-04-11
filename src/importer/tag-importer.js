module.exports = function(Promise, importerFactory) {

  function prepare(connexion) {
    return new Promise(function(resolve, reject) {
      connexion.query('DELETE FROM tag', function(err) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  
  function process(tag) {
    return this.query('INSERT INTO tag (id, name) VALUES (?, ?)', tag.id, tag.name);
  }
  
  return importerFactory.get('tags', prepare, process);
};
