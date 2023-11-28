import * as React from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function EntryEmpleados() {
    const navigate = useNavigate();

    const [name, setName] = useState(null);
    const [loged, setLoged] = useState(false);

    useEffect(() => {
      if (localStorage.getItem("name")){
        setName(localStorage.getItem("name"));
        setLoged(true);
      }
    }, [name, loged]);

const gotoLogin = () =>{
    navigate("/login_employee")
}

const gotoRegister = () =>{
    navigate("/register_employee")
}

return (
    <>
    <ResponsiveAppBar/>
    <Container 
    maxWidth={false}
    disableGutters
    style={{
      backgroundImage: `url("./images/bg1.jpg")`,
      minHeight:"100vh",
      width:"100%",
      backgroundRepeat:"no-repeat",
      backgroundPosition:"center",
      backgroundSize:"cover"
    }}
    >
    <Container
      maxWidth={false}
      disableGutters
      style={{
        width:"100%",
        backgroundColor:`rgba(0,0,0,0.4)`,
        minHeight:"100vh"
      }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          style={{
            minHeight:"100vh"
          }}
        >
          <Grid 
            item xs={12}
            style={{
              border:"2px solid white",
              borderRadius:"20px",
              width:"80%",
              textAlign:"center",
              padding:"20px",
              backgroundColor:`rgba(0,0,0,0.5)`
            }}
            >
            <Typography variant="h2" color="white">Bienvenido</Typography>
            {loged?
                <Typography variant="h4" color="white">{name}</Typography>
              : 
              <Grid container
                spacing={2} 
                justify="center">
                <Grid item xs={6}>
                    <Button variant="contained" color="error" onClick={gotoLogin}>
                        Iniciar Sesion
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" color="error" onClick={gotoRegister}>
                        Trabaja para Nosotros
                    </Button>
                </Grid>
              </Grid>
            }
          </Grid>
        </Grid>
      </Container>
    </Container>
    </>
)}