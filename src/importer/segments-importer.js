module.exports = function(connexion, schema) {
  var table = schema.toSQL() + 'segment';

  this.prepare = function() {
    return connexion.query('DELETE FROM ' + table, { type: connexion.QueryTypes.DELETE });
  };

  this.process = function(segment) {
    return connexion.query('INSERT INTO ' + table + '(id, name, created_at, updated_at) VALUES (?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [segment.id, segment.name, segment.created_at, segment.updated_at]
    });
  };
};
