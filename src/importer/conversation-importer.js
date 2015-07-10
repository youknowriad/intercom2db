module.exports = function(Promise, importerFactory) {

  function prepare(connexion) {
    return connexion.query('DELETE FROM conversation', { type: connexion.QueryTypes.DELETE });
  }
  
  function process(conversation) {
    var connexion = this.connection,
      query = this.query;

    if (['76339', '61190'].indexOf(conversation.conversation_message.author.id) > -1) {
      return Promise.resolve(conversation);
    }

    return query('INSERT INTO conversation (id, message_id, type, created_at, updated_at, subject, body, user_id) VALUES (?, ?, \'c\', ?, ?, ?, ?, ?)', {
      type: connexion.QueryTypes.SELECT,
      replacements: [conversation.id, conversation.conversation_message.id, conversation.created_at, conversation.updated_at, conversation.conversation_message.subject, conversation.conversation_message.body, conversation.conversation_message.author.id]
    }).then(function() {
      var promises = [];

      if(conversation.conversation_parts && conversation.conversation_parts.conversation_parts) {
        conversation.conversation_parts.conversation_parts
          .filter(function(part) {
            return part.part_type === 'comment';
          })
          .forEach(function(part) {
            promises.push(query('INSERT INTO conversation (id, message_id, type, created_at, updated_at, body, user_id) VALUES (?, ?, \'m\', ?, ?, ?, ?)', {
              type: connexion.QueryTypes.SELECT,
              replacements: [conversation.id, part.id, part.created_at, part.updated_at, part.body, part.author.id]
            }));
          });
      }

      return Promise.all(promises);
    });
  }
  
  return importerFactory.get('conversations', prepare, process, true);
};
