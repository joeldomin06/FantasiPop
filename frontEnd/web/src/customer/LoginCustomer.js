import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid } from "@mui/material";
import ResponsiveAppBar from "../ResponsiveAppBar";
import { Container } from "@mui/system";

export default function Login() {
  const [name, setName] = useState("");

  const [rut, setRut] = useState("");

  const [ticket_code, setTicket_code] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const axios = require("axios");

  function validateForm() {
    return password.length > 0 && 
          rut.length > 0 &&
          ticket_code.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      name: name,
      rut: rut,
      ticket_code: ticket_code,
      password: password,
    };
    console.log(payload);
    const res = await axios
      .post("http://localhost:4000/login_customer", payload)
      .catch(function (error) {
        console.log(error.toJSON());
      });
    if (res) {
     localStorage.setItem("name", name);
     localStorage.setItem("rut", rut);
     localStorage.setItem("ticket_code", ticket_code);
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
                  id="rut"
                  label="Rut"
                  variant="outlined"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  />
              </Grid>
              <Grid item xs={16} justify="center">
                <TextField
                  fullWidth
                  id="ticket_code"
                  label="Código del Ticket"
                  variant="outlined"
                  value={ticket_code}
                  onChange={(e) => setTicket_code(e.target.value)}
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
