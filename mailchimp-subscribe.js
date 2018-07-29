const fetch = require('node-fetch');

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  const apiKey = context.secrets.MAILCHIMP_API_KEY;
  const baseUrl = context.secrets.MAILCHIMP_BASE_URL;
  return fetch(`${baseUrl}/lists/${context.query.list}`, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${apiKey}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({
      members: [{
        email_address: context.body.email_address,
        status: 'subscribed'
      }]
    })
  })
  .then(res => {
    if (res.ok) return res.json();
    throw new Error(res);
  })
  .then(res => {
    console.log('added user', res);
    cb(null, { status: 'success', message: res.detail });
  })
  .catch(err => {
    console.error('unable to add user', err.message);
    cb(null, { status: 'error', message: err.message })
  });
};