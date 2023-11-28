import * as React from "react";
import ResponsiveAppBar from "../ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import axios from "axios";


export default function ListGames(){
    //estado del usuario
    const [name, setName] = useState(null);
    const [rut,setRut] = useState(null);
    const [ticket_code,setTicketCode] = useState(null);
    //arreglo de atracciones y nombre de la atraccion a guardar localmente
    const [atractions,setAtractions] = useState([]);
    //const [nameAtraction,setNameAtraction] = useState("");
    //funcion para obtener los valores de la fila
    async function FetchAtractions(rut,ticket_code){
        const url = "http://localhost:4000/place_in_line_customer";
        axios.get(url,{
            params:{
                customer_rut:rut,
                customer_ticket_code:ticket_code
            }
        }).then((response) => {
            if(response.status === 200){
                console.log(response.data.message);
                setAtractions(response.data.message);
            }
        }).catch((error)=>{console.error(error)});
    }
    //realiza el arreglo apenas empieza la pagina
    //Exportar el name de atracción
    
    // Solicitar datos de las si se entá encolado
    // Si ya lo está entonces ver decir desencolar

    //activacion del usuario
    useEffect(() => {
        if (localStorage.getItem("name")){
            setName(localStorage.getItem("name"));
            setRut(localStorage.getItem("rut"));
            setTicketCode(localStorage.getItem("ticket_code"));
        }
    }, [name,rut,ticket_code]);

    useEffect(()=>{
        if(rut){
            FetchAtractions(rut,ticket_code);
        }
    },[rut,ticket_code])
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
                    <Typography variant="h2" align="center">Juegos Encolados</Typography>
                </Grid>
                <Grid item sm={16} md={16} xl={16} style={{width:"80%"}}>
                    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <List component="nav">
                        {atractions.length > 0?
                            atractions.map((atractions)=>(
                                //boton de la lista
                                <ListItemButton
                                key={atractions[3]}
                                >
                                <ListItemText><Typography variant="h4">{atractions[3]}</Typography></ListItemText>
                                </ListItemButton>
                            ))
                            :
                            <ListItemButton>
                                <ListItemText><Typography variant="h4">No te has encolado</Typography></ListItemText>
                            </ListItemButton>
                        }
                        </List>
                    </Box>
                </Grid>
            </Grid>
        </Container>
        </>
    )
}