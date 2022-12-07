require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENTSECRET
});

// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


app.get('/', (req, res) => {
    res.render('index');
});


app.get('/artist-search', (req, res) => {

    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
        const artistsArray = data.body.artists.items
        res.render('artist-search-results.hbs', {artistsArray});

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
    const artistID = req.params.artistId;
    spotifyApi.getArtistAlbums(artistID)

    .then(function(data) {
    const artistAlbums = data.body.items;
    res.render('albums', {artistAlbums});
    }, function(err) {
    console.error(err);
    });

});

