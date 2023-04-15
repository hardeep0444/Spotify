import React from "react";
import { Container } from "react-bootstrap";
import "../styling/Login.css";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=b4a856f3da454537a2438960d92308a3&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify&user-read-playback-state&user-modify-playback-state";

function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center container-class"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  );
}
export default Login;
