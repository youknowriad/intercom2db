module.exports = function() {
  return function(connexion, schema) {
    var table = schema.toSQL() + 'tag';

    this.prepare = function() {
      return connexion.query('DELETE FROM ' + table, { type: connexion.QueryTypes.DELETE });
    };

    this.process = function(tag) {
      return connexion.query('INSERT INTO ' + table + '(id, name) VALUES (?, ?)', {
        type: connexion.QueryTypes.INSERT,
        replacements: [tag.id, tag.name]
      });
    };
  };
};
