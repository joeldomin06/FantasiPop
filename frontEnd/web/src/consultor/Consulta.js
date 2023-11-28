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

export default function Consulta(){
    const [atractions,setAtractions] = useState([]);
    //form
    const [name_atraction,setNameAtraction] = useState("");
    const [datetimei,setDateTimeI] = useState("");
    const [datetimef,setDateTimeF] = useState("");
    const [id,setId] = useState("");
    const [crut,setCRut] = useState("");
    const [cticket_code,setCTicketCode] = useState("");
        //flags
    const [datei_check,setDateICheck] = useState(false);
    const [datef_check,setDateFCheck] = useState(false);
    const [id_check,setIdCheck] = useState(false);
    const [customer_check,setCustomerCheck] = useState(false);
    //download
    const [ready,setReady] = useState(false);
    const [data,setData] = useState([]);
    const [tot_uso,setTotUso] = useState(0);
    const [tot_persona,setTotPersona] = useState(0);

    async function FetchAtractions(){
        const url = "http://localhost:4000/atractions";
        axios.get(url).then((response)=>{
            console.log(response.data.message);
            if(response.status === 200){
                setAtractions(response.data.message);
            }
        }).catch((error)=>{console.error(error)});
      }
    
    const validForm = () => {
        return name_atraction.length > 0;
    }

    function filtro(value,index,self){
        return self.indexOf(value) === index;
    }

    async function FetchFilter(event){
        event.preventDefault();
        const url = "http://localhost:4000/place_in_line_filter";
        axios.get(url,{
            params:{
                id_place_in_line:id,
                customer_rut:crut,
                customer_ticket_code:cticket_code,
                atraction_name:name_atraction,
                init_time:datetimei,
                end_time:datetimef
            }
        }).then((response)=>{
            if(response.status === 200){
                setData(response.data);
                setReady(true);
            }
        })
    }

    const download = ()=>{
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(data)
            )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        let namefile = name_atraction;
        if(datei_check) namefile = namefile+"_"+datetimei;
        if(datef_check) namefile = namefile+"_"+datetimef;
        if(id_check) namefile = namefile+"_"+id;
        if(customer_check) namefile = namefile+"_"+crut+"_"+cticket_code;
        link.download = namefile+".json";
        link.click();
    }
    
    useEffect(()=>{
        FetchAtractions();
    },[]);

    useEffect(()=>{
        if(ready){
            const arr = data.message;
            const cus = arr.map((lista)=>(lista[1]));
            const uni = cus.filter(filtro);
            const per = uni.length;
            setTotUso(arr.length);
            setTotPersona(per);
        }
    },[ready,data])

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
                            <form onSubmit={FetchFilter}>
                                <Grid item xs={12} justify="center">
                                    <TextField
                                        fullWidth
                                        id="name_atraction"
                                        select
                                        label="nombre de la atraccion"
                                        variant="outlined"
                                        helperText="Selecciona el nombre de una atraccion"
                                        onChange={(e) => {setNameAtraction(e.target.value)}}
                                    >
                                        {atractions.map((atraction) => (
                                            <MenuItem key={atraction[0]} value={atraction[0]}>
                                                {atraction[0]}
                                            </MenuItem>
                                        ))
                                        }
                                    </TextField>
                                    {/* Opciones */}
                                    <Grid container spacing={2}
                                    sx={{marginBottom:2}}
                                    >
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                label="Fecha inicial"
                                                control={
                                                <Checkbox 
                                                    checked={datei_check}
                                                    onChange={(e)=>{setDateICheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                id="date-ini"
                                                type="datetime-local"
                                                variant="outlined"
                                                disabled={!datei_check}
                                                onChange={(e)=>{setDateTimeI(e.target.value)}}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel
                                                label="Fecha Final"
                                                control={
                                                <Checkbox 
                                                    checked={datef_check}
                                                    onChange={(e)=>{setDateFCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                id="date-fin"
                                                type="datetime-local"
                                                variant="outlined"
                                                disabled={!datef_check}
                                                onChange={(e)=>{setDateTimeF(e.target.value)}}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControlLabel
                                                label="ID"
                                                control={
                                                <Checkbox 
                                                    checked={id_check}
                                                    onChange={(e)=>{setIdCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                inputProps={{min:0}}
                                                type="number"
                                                disabled={!id_check}
                                                onChange={(e)=>{setId(e.target.value)}}
                                                label="ID"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControlLabel
                                                label="Cliente"
                                                control={
                                                <Checkbox 
                                                    checked={customer_check}
                                                    onChange={(e)=>{setCustomerCheck(e.target.checked)}}
                                                />}
                                            ></FormControlLabel>
                                            <TextField
                                                fullWidth
                                                disabled={!customer_check}
                                                onChange={(e)=>{setCRut(e.target.value)}}
                                                label="Rut"
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                disabled={!customer_check}
                                                onChange={(e)=>{setCTicketCode(e.target.value)}}
                                                label="Ticket Code"
                                                sx={{
                                                    marginTop:5
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="contained" 
                                        color="secondary"
                                        disabled={!validForm()}
                                        type="submit"
                                    >
                                            Consultar
                                        </Button>
                                </Grid>
                            </form>
                            <Container disableGutters>
                                {name_atraction.length > 0?
                                    <Typography variant="h2" align="center">{name_atraction}</Typography>
                                    :
                                    <Typography variant="h2" align="center">Consultar</Typography>
                                }
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h4" align="center">N° veces encolados</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h4" align="center">Total de personas encoladas</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h4" align="center">{tot_uso}</Typography>
                                    </Grid>                                    
                                    <Grid item xs={6}>
                                        <Typography variant="h4" align="center">{tot_persona}</Typography>
                                    </Grid>
                                </Grid>
                                <br></br>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={download}
                                    disabled={!ready}
                                    >
                                    Descargar
                                </Button>
                            </Container>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}