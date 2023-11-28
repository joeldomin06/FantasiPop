import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Container } from "@mui/material";
import ResponsiveAppBar from "../ResponsiveAppBar";


export default function Register() {
  const [rut, setRut] = useState("");

  const [ticket_code, setTicket_code] = useState("");
  
  const [name, setName] = useState("");
  
  const [email, setEmail] = useState("");
  
  const [password, setPassword] = useState("");
  
  const [phone_number, setPhone_number] = useState("");
  
  const axios = require("axios");

  const navigate = useNavigate();

  function validateForm() {
    return (
      rut.length > 0 &&
      ticket_code.length > 0 &&
      name.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      phone_number.length > 0
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      rut: rut,
      ticket_code: ticket_code,
      name: name,
      email: email,
      password: password,
      phone_number: phone_number
    };
    console.log(payload);
    const res = await axios
      .post("http://localhost:4000/register_customer", payload)
      .catch(function (error) {
        console.log(error.toJSON());
      });
    if (res) {
      navigate("/login_customer");
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
            <Grid item xs={16} justify="center">
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <TextField
                fullWidth
                id="phone_number"
                label="Número de Teléfono"
                variant="outlined"
                value={phone_number}
                onChange={(e) => setPhone_number(e.target.value)}
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
