import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react';

const ResponsiveAppBar = (props) => {

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [settings, setSettings] = React.useState(["Iniciar Sesion", "Registrarse", "Empleados"]);
  const [name, setName] = React.useState(null);
  const [type,setType] = React.useState(null);
  const [pages,setPages] = useState([]);
  //flag que esta logueado

  const lists = {
    customer: [{"name":"Inicio","href":"/"},
    {"name":"Atracciones","href":"/game"}],
    consultor: [{"name":"Consulta","href":"/consulta"}],
    manager: [{"name":"Estado Atracciones","href":"/manager"},
    {"name":"Registrar Atraccion","href":"/register_game"}]
  }

  useEffect(() => {
    setName(localStorage.getItem("name"));
    if(localStorage.getItem("type")){
      setType(localStorage.getItem("type"))
      if(type === "300"){
        setPages(lists.consultor);
      }else if(type === "100"){
        setPages(lists.manager);
      }
    }else{
      setPages(lists.customer);
    }
    if (name){
      setSettings(["Atracciones en espera","Cerrar Sesion"]);
    } else {
      setSettings(["Iniciar Sesion", "Registrarse","Empleados"]);
    }
  }, [name,type,pages,lists.consultor,lists.customer,lists.manager]);
  
  //paginas de la barra
  /*
  const pages = [
    {"name":"Inicio","href":"/"},
    {"name":"Atracciones","href":"/game"},
    {"name":"Registrar Atraccion","href":"/register_game"},
    {"name":"consulta","href":"/consulta"}
  ];*/

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (e) => {
    if (e.target.innerText === "Cerrar Sesion") {
      localStorage.removeItem("name");
      if(localStorage.getItem("rut")) localStorage.removeItem("rut");
      if(localStorage.getItem("ticket_code")) localStorage.removeItem("ticket_code");
      if(localStorage.getItem("type")) localStorage.removeItem("type");
      navigate("/");
    } else if (e.target.innerText === "Iniciar Sesion") {
      navigate("/login_customer");
    } else if (e.target.innerText === "Registrarse") {
      navigate("/register_customer");
    } else if (e.target.innerText === "Atracciones en espera"){
      navigate("/list_games");
    } else if (e.target.innerText === "Empleados"){
      navigate("/employee");
    }
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Fantasipop
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current name"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Button 
                    textalign="center" 
                    href={page.href}
                    variant="text"
                  >
                  {page.name}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                href={page.href}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={name} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
