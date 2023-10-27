const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

const links = [];

app.use(bodyParser.json());
app.use(express.static('public'));


function generateShortLink() {
  return uuid.v4().substring(0, 6);
}

//Expiration Time
app.post('/shorten', (req, res) => {
  const { longUrl, expirationTime } = req.body;

  // Calculating the expiration date based on the expirationTime
  let expirationDate;
  switch (expirationTime) {
      case '1m':
          expirationDate = moment().add(1, 'minute').format('YYYY-MM-DD HH:mm');
          break;
      case '5m':
          expirationDate = moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm');
          break;
      case '30m':
          expirationDate = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm');
          break;
      case '1h':
          expirationDate = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm');
          break;
      case '5h':
          expirationDate = moment().add(5, 'hours').format('YYYY-MM-DD HH:mm');
          break;
      default:
          expirationDate = moment().add(7, 'days').format('YYYY-MM-DD HH:mm');
  }

  // Generating a short link and saving it with the expiration date
  const shortLink = generateShortLink();
  links.push({ shortLink, longUrl, expirationDate });
  res.json({ shortLink });
});

app.get('/s/:shortLink', (req, res) => {
  const { shortLink } = req.params;
  const link = links.find((l) => l.shortLink === shortLink);

  if (!link) {
    console.log(`Short link not found: ${shortLink}`);
    res.status(404).send('Short link not found.');
  } else if (link.expirationDate && moment() > moment(link.expirationDate)) {
    console.log(`Link has expired: ${shortLink}`);
    res.status(410).send('Link has expired.');
  } else {
    console.log(`Redirecting to: ${link.longUrl}`);
    res.redirect(link.longUrl);
  }
});

app.delete('/delete/:shortLink', (req, res) => {
  const { shortLink } = req.params;
  const index = links.findIndex((l) => l.shortLink === shortLink);

  if (index === -1) {
    res.status(404).send('Short link not found.');
  } else {
    links.splice(index, 1);
    res.status(200).send('Link deleted successfully.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

