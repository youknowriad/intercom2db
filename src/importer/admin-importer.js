module.exports = function(Promise, importerFactory) {
  function prepare() {
    return Promise.resolve([]);
  }

  function process(user) {
    var connexion = this.connection,
      query = this.query;

    return query('INSERT INTO users (id, name, email) VALUES (?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [user.id, user.name, user.email]
    });
  }

  return importerFactory.get('admins', prepare, process);
};

