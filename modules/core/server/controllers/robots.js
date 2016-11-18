'use strict';

module.exports = {
  getFile: (req, res) => {
    let text = 'User-agent: *\nDisallow: /';

    if (req.hostname === 'admin.voluntariosos.org') {
      text = 'Sitemap: https://admin.voluntariosos.org/sitemap.xml';
    }

    res.send(text);
  }
};