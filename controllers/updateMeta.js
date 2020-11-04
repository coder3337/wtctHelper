const fetch = require('node-fetch');

/* function getDisplayName() {
  const url = process.env.AUTHO_POST_ENDPOINT;

  (function(user, context, callback) {
    user.user_metadata = user.user_metadata || {};
    user.user_metadata.displayName = user.user_metadata.displayName || 'user';

    auth0.users.updateUserMetadata( user.user_id, user.user_metadata )
        .then(function() {
          callback(null, user, context);
        })
        .catch(function(err) {
          callback(err);
        });
  });

  const options = {
    headers: {authorization: 'Bearer ' + process.env.AUTHO_TOKEN},
  };

  // fetch(new URL(url, baseURL))

  fetch(url, options).then(function(response) {
    //console.log('get', response.text());
  })
      .catch(function(error) {
        console.error(error);
      });
}; */

function updateDisplayName() {
  const baseURL = 'http://localhost';
  const url = process.env.AUTHO_POST_ENDPOINT;

  fetch(new URL(url, baseURL, {
    method: 'PATCH',
    headers: {authorization: 'Bearer ' + process.env.AUTHO_TOKEN},
    body: '{"user_metadata": {"opmail": "test op mail"}',
  }))
      .then(function(response) {
        // response;
        // console.log('update', response.text());
      }).catch(function(error) {
        console.error(error);
      });
};

/* module.exports.getDisplayName = getDisplayName;
 */module.exports.updateDisplayName = updateDisplayName;
