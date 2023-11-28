import './App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';

import Entrypoint from './Entrypoint';
import Login from './user/Login';
import Register from './user/Register';
//rutas hechas
import Game from './games/Game';
import RegisterCustomer from './customer/RegisterCustomer';
import LoginCustomer from './customer/LoginCustomer';
import RegisterAtraction from './games/RegisterAtraction';
import DetailGame from './games/DetailGame';
import ListGames from './customer/ListGames';
import Consulta from './consultor/Consulta';
import LoginEmployee from './employee/LoginEmployee';
import RegisterEmployee from './employee/RegisterEmployee';
import EntryEmpleados from './EntryEmpleado';
import Manager from './manager/Manager';
import EditGame from './manager/EditGame';

import { Routes, Route, BrowserRouter } from 'react-router-dom';


function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background:{
        default:grey[900],
        paper:"#121212",
      }
    },
  });  

  return (
      <>
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Entrypoint />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/*rutas hechas*/}
              <Route path='/game' element={<Game />} />
              <Route path="/detail_game" element={<DetailGame />} />
              <Route path="/register_customer" element={<RegisterCustomer />} />
              <Route path="/login_customer" element={<LoginCustomer />} />
              <Route path="/register_game" element={<RegisterAtraction />} />
              <Route path="/list_games" element={<ListGames />} />
              <Route path="/consulta" element={<Consulta />} />
              <Route path="/employee" element={<EntryEmpleados />} />
              <Route path="/login_employee" element={<LoginEmployee />} />
              <Route path="/register_employee" element={<RegisterEmployee />} />
              <Route path="/manager" element={<Manager />} />
              <Route path="/edit_game" element={<EditGame />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </>
  );
}

export default App;
