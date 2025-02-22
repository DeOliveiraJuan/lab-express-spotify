require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
    console.log("It's working fine")
    res.render('index')
})

// Search artist
app.get('/artist-search', (req, res, next) => {
  const { name } = req.query
  console.log(req.query);
  
  spotifyApi
    .searchArtists(name)
    .then(data => {
      const artists = data.body.artists.items;
      console.log('The received data from the API: ', artists);
      res.render('artist-search-results', { artists })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

// Search album
app.get('/albums/:id', (req, res, next) => {
  const { id } = req.params
  console.log(req.params);

spotifyApi
  .getArtistAlbums(id)
  .then(data => {
      const albums = data.body.items;
      console.log('The received data from the API: ', albums);
      res.render('albums', { albums })
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})

//Search track
app.get('/tracks/:id', (req, res, next) => {
  const { id } = req.params

  spotifyApi
  .getAlbumTracks(id)
  .then(data => {
      const tracks = data.body.items;
      //console.log('The received data from the API: ', tracks);
      res.render('tracks', { tracks })
  })
  .catch(err => console.log('The error while searching tracks occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

  

