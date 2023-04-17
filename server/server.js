require("dotenv").config();
const express = require("express");
const SpotifyWebAPI = require("spotify-web-api-node");
const LyricsFinder = require("lyrics-finder");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// --------Taking the code and generating the access token---------

app.post("/login", (request, response) => {
  const code = request.body.code;
  const spotifyApi = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      response.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.log("Error : " + error);
      response.sendStatus(400);
    });
});

// ---------generating refresh token----------

app.post("/refresh", (request, response) => {
  const refreshToken = request.body.refreshToken;
  const spotifyApi = new SpotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log("The access token has been refreshed!");
      console.log(data.body);
      // Save the access token so that it's used in future calls
      response.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.log("Error : " + error);
      response.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await LyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics available";
  res.json({ lyrics });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
