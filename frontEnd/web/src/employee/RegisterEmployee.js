import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Container } from "@mui/material";
import ResponsiveAppBar from "../ResponsiveAppBar";


export default function RegisterEmployee() {
  const [id, setId] = useState("");
  
  const [name, setName] = useState("");
  
  const [password, setPassword] = useState("");
  
  const axios = require("axios");

  const navigate = useNavigate();

  function validateForm() {
    return (
      id.length > 0 &&
      name.length > 0 &&
      password.length > 0
    );
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
          .post("http://localhost:4000/register_consultant", payload)
          .catch(function (error) {
            console.log(error.toJSON());
          });
    }else if(id.slice(0,3) === "100"){
      res = await axios
          .post("http://localhost:4000/register_manager", payload)
          .catch(function (error) {
            console.log(error.toJSON());
          });
    }
    if (res) {
      navigate("/login_employee");
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
          style={{ minHeight: '110vh', width:"80%", marginLeft:"10%"}}
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
                }}
          >
            <Grid item xs={16} justify="center">
              <TextField
                fullWidth
                id="id"
                label="id de la empresa"
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
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      </Container>
    </>
  );
}
