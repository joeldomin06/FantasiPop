import * as React from "react";
import ResponsiveAppBar from "../ResponsiveAppBar";
import {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

export default function EditGame(){
    //form
    //gets
    const [name_atraction,setNameAtraction] = useState("");
    //puts
    const [newestado,setNEstado] = useState("");
    const [newcapacite,setNCapacite] = useState("");
    const [newmean_time,setNMeanTime] = useState("");
    const [newdescription,setNDescription] = useState("");
    //flags
    const [estadocheck,setEstadoCheck] = useState(false);
    const [capacitecheck,setCapaciteCheck] = useState(false);
    const [meantimecheck,setMeanTimeCheck] = useState(false);
    const [descriptioncheck,setDescriptionCheck] = useState(false);

    async function PutAtraction(event){
        event.preventDefault();
        const url = "http://localhost:4000/atraction_update";
        axios.put(url,null,{
            params:{
                name_atraction:name_atraction,
                state:newestado,
                capacite:newcapacite,
                mean_time:newmean_time,
                description:newdescription,
            }
        }).then((response)=>{
            if(response.status === 200){
                alert(response.data.message);
            }
        }).catch(error=>{console.error(error)})
    }
    
    useEffect(() =>{
        const nameAtraction = localStorage.getItem("nameAtraction");
        if(nameAtraction){
            setNameAtraction(nameAtraction);
        }
    },[name_atraction])

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
                    <Grid item xs={16}>
                        <Grid 
                            container 
                            spacing={2} 
                            justify="center" 
                            direction="column"
                            sx={{
                                marginTop:10,
                                marginBottom:5, 
                                padding:2,
                                border:"2px solid black",
                                bgcolor:"background.paper",
                                width:"100vh",
                                minHeight:"100vh",
                                borderRadius:"10px"
                            }}
                        >
                            <form onSubmit={PutAtraction}>
                                <Grid item xs={12} justify="center">
                                    <Typography variant="h2">{name_atraction}</Typography>
                                    {/* Opciones */}
                                    <Grid container spacing={2}
                                    sx={{marginBottom:2}}
                                    >
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                label="Estado"
                                                control={
                                                <Checkbox 
                                                    checked={estadocheck}
                                                    onChange={(e)=>{setEstadoCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                id="estado"
                                                select
                                                variant="outlined"
                                                disabled={!estadocheck}
                                                onChange={(e)=>{setNEstado(e.target.value)}}
                                            >
                                                <MenuItem value="Activo"></MenuItem>
                                                <MenuItem value="Inactivo"></MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                label="Capacidad"
                                                control={
                                                <Checkbox 
                                                    checked={capacitecheck}
                                                    onChange={(e)=>{setCapaciteCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                id="Capacite"
                                                inputProps={{min:0,max:99,maxLength:2}}
                                                type="number"
                                                variant="outlined"
                                                disabled={!capacitecheck}
                                                onChange={(e)=>{setNCapacite(e.target.value)}}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                label="Tiempo promedio"
                                                control={
                                                <Checkbox 
                                                    checked={meantimecheck}
                                                    onChange={(e)=>{setMeanTimeCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                id="MeanTime"
                                                fullWidth
                                                inputProps={{min:0,max:99,maxLength:2}}
                                                type="number"
                                                disabled={!meantimecheck}
                                                onChange={(e)=>{setNMeanTime(e.target.value)}}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                label="Descripcion"
                                                control={
                                                <Checkbox 
                                                    checked={descriptioncheck}
                                                    onChange={(e)=>{setDescriptionCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                disabled={!descriptioncheck}
                                                inputProps={{maxLength:200}}
                                                onChange={(e)=>{setNDescription(e.target.value)}}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="contained" 
                                        color="secondary"
                                        type="submit"
                                    >
                                            Modificar Atraccion
                                        </Button>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}