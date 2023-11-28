import * as React from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Entrypoint() {
    const [name, setName] = useState(null);
    const [loged, setLoged] = useState(false);
  
    useEffect(() => {
      if (localStorage.getItem("name")){
        setName(localStorage.getItem("name"));
        setLoged(true);
      }
    }, [name, loged]);
  
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
              <Typography variant="h4" color="white">A Fantasi-Pop</Typography>}
          </Grid>
        </Grid>
      </Container>
    </Container>
    </>
)}