import * as React from "react";
import ResponsiveAppBar from "../ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useNavigate } from "react-router-dom";

export default function RegisterGame(){
    //estado del usuario
    const [name, setName] = useState(null);
    const [loged, setLoged] = useState(false);
    
    const [nameAtraction, setNameAtraction] = useState("");
    const [state, setState] = useState("");
    const [capacite, setCapacite] = useState("");
    const [meanTime, setMeanTime] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const axios = require("axios");
    function validateForm() {
        return nameAtraction.length > 0 &&
            state.length > 0 &&
            capacite.length > 0 &&
            capacite.length < 3 &&
            meanTime.length > 0 &&
            meanTime.length < 3 &&
            description.length > 0 &&
            !isNaN(parseInt(capacite)) &&
            !isNaN(parseInt(meanTime)) &&
            (state === "Activo" || state === "Inactivo");
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const payload = {
            name_atraction: nameAtraction,
            state: state,
            capacite: capacite,
            mean_time: meanTime,
            description: description,
        };
        console.log(payload);
        const res = await axios
            .post("http://localhost:4000/register_atraction", payload)
            .catch(function (error) {
            console.log(error.toJSON());
            });
        if (res) {
            navigate("/");
        }
    }

    //activacion del usuario
        useEffect(() => {
            if (localStorage.getItem("name")){
            setName(localStorage.getItem("name"));
            setLoged(true);
            }
        }, [name, loged]);
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
                <Grid item sm={10} md={8}>
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
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            id="nameAtraction"
                            label="Nombre de la atracción"
                            variant="outlined"
                            value={nameAtraction}
                            onChange={(e) => setNameAtraction(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="state"
                            label="Estado de la atracción"
                            variant="outlined"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="capacite"
                            label="Capacidad"
                            variant="outlined"
                            value={capacite}
                            onChange={(e) => setCapacite(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            id="meanTime"
                            label="Tiempo promedio del uso de la atracción"
                            variant="outlined"
                            value={meanTime}
                            onChange={(e) => setMeanTime(e.target.value)}
                        />  
                        <TextField
                            fullWidth
                            id="description"
                            label="Descripción de la atracción"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Grid container>
                            <Grid item xs={2}></Grid>
                            <Grid item xs={8}>
                                <Button 
                                    size="large" 
                                    variant="contained" 
                                    color="error" 
                                    type="submit"
                                    disabled={!validateForm()}
                                    fullWidth
                                >
                                    Registrar Juego
                                </Button>
                            </Grid>
                            <Grid item xs={2}></Grid>
                        </Grid>
                    </form>
                    </Grid>
                </Grid>
                </Grid>
            </Container>
            </>
        )
}