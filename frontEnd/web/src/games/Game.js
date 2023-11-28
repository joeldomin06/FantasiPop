import * as React from "react";
import ResponsiveAppBar from "../ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Circle from "@mui/icons-material/Circle";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Game(){
    //estado del usuario
    const [name, setName] = useState(null);
    const [loged, setLoged] = useState(false);
    const [atractions,setAtractions] = useState([]);
    const navigate = useNavigate();
    
    async function FetchAtractions(){
      const url = "http://localhost:4000/atractions";
      axios.get(url).then((response)=>{
        if(response.status === 200){
          setAtractions(response.data.message);
        }
      }).catch((error)=>{console.error(error)});
    }

    //activacion del usuario
    useEffect(() => {
        if (localStorage.getItem("name")){
          setName(localStorage.getItem("name"));
          setLoged(true);
        }
      }, [name, loged]);
    
    useEffect(()=>{
        FetchAtractions();
    },[]);

    //realiza el arreglo apenas empieza la pagina
    //funcion para redirigir a detalle (agregar y hacer pagina con Queue como base)
    async function handleRedirect(event,name_atraction){
      event.preventDefault();
      if(localStorage.getItem("name")){
        localStorage.setItem("nameAtraction",name_atraction);
        navigate("/detail_game");
      }
    }
    //pagina
    return (
        <>
        <ResponsiveAppBar/>
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
            justifyContent="center"
            alignItems="center"
            direction="column"
            style={{minHeight:"100vh"}}
          >
            <Grid item sm={16} md={16} xl={16} style={{width:"80%"}}>
            {/*colocar en vez de que si esta logueado, es que si esta vacio, entonces entregara un titulo diciendo no hay juegos disponibles :(*/}
            {loged?
              <>
              {atractions.length > 0?
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <List component="nav">
                    {/*Se otiene cada objeto y se genera un arreglo tipo [name_atraccion,state,capacite,mean_time,description], para acceder a estos hacerlo por los indices*/}
                    {atractions.map((atractions)=>(
                      //boton de la lista
                      <ListItemButton
                        key={atractions[0]}
                        onClick={e =>handleRedirect(e,atractions[0])}
                        >
                        <ListItemIcon>
                          {atractions[1] === "Activo"?
                            <Circle color="success"/>
                            :
                            <Circle color="error"/>
          
                          }
                        </ListItemIcon>
                        <ListItemText><Typography variant="h4">{atractions[0]}</Typography></ListItemText>
                      </ListItemButton>
                    ))
                  }
                  </List>
                </Box>
                :
                <Grid 
                  container 
                  justify="center" 
                  direction="column" 
                  alignItems="center"
                  sx={{
                    border:"0.2px solid black",
                    borderRadius:"10px",
                    padding:"20px",
                    bgcolor:"background.paper",
                }}
                >
                  <Typography align="center" variant="h6">
                    ¡No existe ningun juego de momento!
                  </Typography>
                  <Button href="/" size="large" variant="contained" color="error">
                    Volver al inicio
                  </Button>
                </Grid>
              }
              </>
            :
            <Grid 
              container 
              justify="center" 
              direction="column" 
              alignItems="center"
              sx={{
                border:"0.2px solid black",
                borderRadius:"10px",
                padding:"20px",
                bgcolor:"background.paper",
            }}
            >
              <Typography align="center" variant="h6">
                ¡Para Encolarte debes iniciar session!
              </Typography>
              <Button href="/login_customer" size="large" variant="contained" color="error">
                Login
              </Button>
            </Grid>
            }
            </Grid>
          </Grid>
        </Container>
        </>
)}