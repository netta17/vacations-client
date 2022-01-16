
import './App.css';
import Header from './components/Header/Header';
import Container from './components/VacationsContainer/Vacationscontainer';
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import RegisterModal from './components/EditVacationModal/EditVacationModal';
import Loginmodal from './components/LoginAndLogupModal/LoginAndLogupModal';
import axios, { AxiosResponse } from 'axios';
import { ActionType } from './redux/action-type';
import { ILogin } from './Models/ILogin';
import { IUser } from './Models/IUser';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';



function App() {

  let dispatch = useDispatch()

  let savedUserDetails = JSON.parse(sessionStorage.getItem(`savedUserDetails`));

  //After user refresh the page or closed the tab.
  if (savedUserDetails) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedUserDetails.userToken}`;

    axios.get<ILogin, AxiosResponse<IUser>>("http://34.65.97.206:3001/users")
      .then((response) => {
        dispatch({ type: ActionType.OnClickSignIn, payload: { token: savedUserDetails.userToken, userId: response.data.userId, userType: response.data.userType } });
      })
      .catch((error: any) =>
        console.log(error)
      )
    connectSocket(savedUserDetails.userToken)
  }

  function connectSocket(token: string) {

    if (token) {
      const socket = io('http://34.65.97.206:8000/', { query: { token } }).connect();
      console.log("here");

      socket.on("deleteVacation", deletedVacationId => {
        console.log(deletedVacationId);
        dispatch({ type: ActionType.DeleteVacation, payload: { vacationId: deletedVacationId } });
      });

      socket.on("addVacation", vacationsDetails => {
        dispatch({ type: ActionType.AddVacation, payload: { vacationId: vacationsDetails.vacationId, vacationDestination: vacationsDetails.vacationDestination, price: vacationsDetails.price, img: vacationsDetails.img, startDate: vacationsDetails.startDate, endDate: vacationsDetails.endDate } });
      });

      socket.on("editVacation", vacationsDetails => {
        console.log(vacationsDetails);
        dispatch({ type: ActionType.EditVacation, payload: { vacationId: vacationsDetails.vacationId, vacationDestination: vacationsDetails.vacationDestination, price: vacationsDetails.price, img: vacationsDetails.img, startDate: vacationsDetails.startDate, endDate: vacationsDetails.endDate } });
      });

    }
  }
  return (
    <div className="App">

      <BrowserRouter>

        <Header />
        <Loginmodal />
        <Switch>
          <Route path="/register" component={RegisterModal} exact />
          <Route path="/home" component={Container} exact />
          <Redirect from="/" to="/home" exact />
        </Switch>

      </BrowserRouter>
    </div>
  );
}

export default App;