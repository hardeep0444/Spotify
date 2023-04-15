import React, { useEffect, useState } from "react";
import useAuth from "../useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResults from "./TrackSearchResults";
import Player from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

function DashBoard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
    console.log("track playing", track);
  }

  console.log(searchResults);

  // ----Lyrics ----
  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  // -----setAccessToken---------
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // ----setSearchResults---------
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false; //this is needed because everytime a search is made or a key is pressed it will wait for sometime and as soon as we stop typing it will give results

    spotifyApi.searchTracks(search).then((data) => {
      if (cancel) return;

      setSearchResults(
        data.body.tracks.items.map((track) => {
          //picking the smallest alubum image
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumImage: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="dashboard"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResults
            key={track.uri}
            track={track}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}

export default DashBoard;
