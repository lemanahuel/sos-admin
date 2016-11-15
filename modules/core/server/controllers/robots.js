'use strict';

module.exports = {
  getFile: (req, res) => {
    let text = 'User-agent: *\nDisallow: /';

    if (req.hostname === 'www.coderhouse.io') {
      text = 'Sitemap: https://www.coderhouse.io/sitemap.xml';
    }

    res.send(text);
  },

  alexaVerification: (req, res) => {
    res.send('<html><head><meta name="alexaVerifyID" content="m3TAK8ueVrNB4xPscqvVRSMu0Aw" /></head><body></body></html>');
  }
};
