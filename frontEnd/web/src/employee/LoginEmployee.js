import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid } from "@mui/material";
import ResponsiveAppBar from "../ResponsiveAppBar";
import { Container } from "@mui/system";

export default function LoginEmployee() {
  const [name, setName] = useState("");

  const [id, setId] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const axios = require("axios");

  function validateForm() {
    return password.length > 0 && 
          id.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
        id_company: id,
        name: name,
        password: password,
    };
    console.log(payload);
    let res;
    if(id.slice(0,3) === "300"){
      res = await axios
      .post("http://localhost:4000/login_consultant", payload)
      .catch(function (error) {
          console.log(error.toJSON());
      });
      localStorage.setItem("type","300"); //esto podria mejorar si hubiera un mecanismo de seguridad
    } else if(id.slice(0,3) === "100"){
      res = await axios
        .post("http://localhost:4000/login_manager", payload)
        .catch(function (error) {
            console.log(error.toJSON());
        });
        localStorage.setItem("type","100"); //esto podria mejorar si hubiera un mecanismo de seguridad
    }
    if (res) {
     localStorage.setItem("name", name);
      navigate("/");
    }
  }

  return (
    <>
      <ResponsiveAppBar />
      <Container
        maxWidth={false}
        disableGutters
        style={{
          width:"100%",
          minHeight:"100vh"
        }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
        >
          <form onSubmit={handleSubmit}>
            <Grid 
              container spacing={2} 
              justify="center" 
              sx={{ 
                paddingRight: 2, 
                paddingBottom: 2,
                border:"2px solid black",
                bgcolor:"background.paper",
                borderRadius:"10px"
                }}>
              <Grid item xs={16} justify="center">
                <TextField
                  fullWidth
                  id="id"
                  label="Id de la compañia"
                  variant="outlined"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  />
              </Grid>
              <Grid item xs={16} justify="center">
                <TextField
                  fullWidth
                  id="name"
                  label="Nombre"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  />
              </Grid>
              <Grid item xs={16}>
                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
              </Grid>
              <Grid item xs={16}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={!validateForm()}
                >
                  Iniciar sesión
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Container>
    </>
  );
}
