import Oauth2 from 'torii/providers/oauth2-code';

const oauthUrl = undefined;

export default Oauth2.extend({
  name:       'liquid',
  baseUrl:    `${oauthUrl || 'http://localhost:8000'}/o/authorize`,
  responseParams: ['code', 'state']
});
