import * as React from "react";
import ResponsiveAppBar from "../ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Circle from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export default function DetailGame(){
    //estado del usuario
    const [name, setName] = useState(null);
    const [rut,setRut] = useState(null);
    const [ticket_code,setTicketCode] = useState(null);
    const [notempty,setNotEmpty] = useState(false);
    const [atraction,setAtraction] = useState([]);
    const [loged, setLoged] = useState(false);
    const [name_atraction,setNameAtraction] = useState(null);
    const navigate = useNavigate();
    const [id_encolado,setIdEncolado] = useState(null);
    const [encolado,setEncolado] = useState(false);

    async function FetchAtraction(name){
        const url = "http://localhost:4000/atraction";
        axios.get(url,{
            params:{
                name_atraction:name
            }
        }).then(function(response){
            if(response.status === 200){
                setAtraction(response.data.message);
            }
        }).catch((error)=>{console.error(error)});
    }

    async function FetchEncolado(rut,ticket_code,atraction_name){
        const url = "http://localhost:4000/place_in_line_atraction/";
        axios.get(url,{
                    params:{
                        customer_rut:rut,
                        customer_ticket_code:ticket_code,
                        atraction_name:atraction_name
                    }
                }).then(function(response){
                    if(response.status === 200){
                        setEncolado(true);
                        setIdEncolado(response.data.message[0].toString());
                    }
                }).catch(function(error){console.error(error)});
    }

    useEffect(() => {
        const name = localStorage.getItem("name");
        if (name){
            setName(name);
            const rut_n = localStorage.getItem("rut");
            const ticket_code_n = localStorage.getItem("ticket_code")
            setRut(rut_n);
            setTicketCode(ticket_code_n);
            const nameAtraction = localStorage.getItem("nameAtraction");
            if(nameAtraction){
                setNotEmpty(true);
                setNameAtraction(nameAtraction);
            }
            setLoged(true);
        }
    }, [name, loged, rut, ticket_code, name_atraction]);

    useEffect(()=>{
        if(name){
            if(name_atraction){
                FetchAtraction(name_atraction);
                FetchEncolado(rut,ticket_code,name_atraction);
            }
        }
    },[name,name_atraction,ticket_code,rut])
    
    async function handleDelete(event,id){
        event.preventDefault();
        const url = "http://localhost:4000/delete_place_in_line/";
        await axios.delete(url,{
            params:{
                id_place_in_lines:id,
            }
        }).then(function(response){
            if(response.status === 201){
                navigate("/game");
            }
        })
        .catch(function (error){console.error(error.toJSON());});

    }

    async function handlePost(event,rut,ticket_code,atraction){
        event.preventDefault();
        const payload = {
            customer_rut:rut,
            customer_ticket_code:ticket_code,
            atraction_name:atraction
        }
        const url = "http://localhost:4000/register_place_in_line/";
        axios.post(url,payload).then(()=>{navigate("/game")}).catch(function (error){console.error(error.toJSON());});
    }

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
                {loged?
                    <>
                    {notempty?
                        <>
                            <Card
                                sx={{
                                minHeight: "100vh"
                                }}
                                >
                                <Skeleton variant="rectangular" height="75vh"></Skeleton>
                                <CardContent>
                                <Typography align="center" variant="h3">
                                    {atraction[0]}
                                </Typography>
                                <Grid container spacing={1} rowSpacing={1}>
                                    <Grid item xs={4}>
                                    <Typography>Estado:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                    <Typography>Tiempo Promedio:</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>Capacidad Max:</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        {atraction[1] === "Activo"?
                                            <Circle fontSize="small" color="success" />
                                            :
                                            <Circle fontSize="small" color="error" />
                                        }
                                    </Grid>
                                    <Grid item xs={3}>
                                    <Typography>{atraction[1]}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                    <Typography>{atraction[3]}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                    <Typography>{atraction[2]}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography textAlign="center" variant="h5">{atraction[4]}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {atraction[1] === "Activo"?
                                            <>
                                                {!encolado?
                                                    <Button variant="contained" color="secondary" onClick={(e) => handlePost(e,rut,ticket_code,atraction[0])} fullWidth>
                                                        Encolarse
                                                    </Button>
                                                    :
                                                    <Button variant="contained" color="error" onClick={(e) => handleDelete(e,id_encolado)} fullWidth>
                                                        Desencolarse
                                                    </Button>
                                                }
                                            </>
                                            :
                                            <>
                                                <Button variant="contained" color="secondary" fullWidth disabled>
                                                    Encolarse
                                                </Button>
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        </>
                        :
                        <>
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
                        </>
                    }
                    </>
                    :
                    <>
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
                    </>
                }
            </Grid>
          </Grid>
        </Container>
        </>
    )
}