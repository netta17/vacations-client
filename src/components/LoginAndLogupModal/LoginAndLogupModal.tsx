

import { Button, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import "./LoginAndLogupModal.css";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ChangeEvent, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { AppState } from "../../redux/app-state";
import axios, { AxiosResponse } from "axios";
import { ILogin } from "../../Models/ILogin";
import { io } from 'socket.io-client';
import { IUser } from "../../Models/IUser";

export default function LoginAndLogupModal() {

  let dispatch = useDispatch()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isRegisterClicked, setRegisterClicked] = useState(false);
  const currentUser = useSelector((state: AppState) => state.currentUser);

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [firstName, setFirstname] = useState("");
  let [lastName, setLastName] = useState("");

  let onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => { setUsername(event.target.value); }
  let onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value); }
  let onFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => { setFirstname(event.target.value); }
  let onLastNameChange = (event: ChangeEvent<HTMLInputElement>) => { setLastName(event.target.value); }

//Login
  const login = () => {
    if (!username) {
      alert('Username field is empty');
      return;
    }

    if (!password) {
      alert('Password field is empty');
      return;
    }

    let loginRequestBody = {
      username,
      password
    }


    axios.post<ILogin, AxiosResponse<IUser>>("http://34.65.97.206:3001/users/login", loginRequestBody)
      .then((response) => {

        if (!response.data.token) {
          alert("General error - Please talk to the manager");
          return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        let userDetails = {
          userToken: response.data.token,
        }
        let token = response.data.token;

        let savedUserDetails = JSON.stringify(userDetails);
        sessionStorage.setItem(`savedUserDetails`, savedUserDetails);
        dispatch({ type: ActionType.OnClickSignIn, payload: { token: response.data.token, userType: response.data.userType, userId: response.data.userId } });

        axios.get("http://34.65.97.206:3001/followedVacations")
          .then((response) => {
            let followedVacationsId = response.data
            dispatch({ type: ActionType.getAllFollowedVacations, payload: followedVacationsId })
          })
        handleClose();
        connectSocket(token);

      })
      .catch((error: any) =>
        alert("Login failed.Username or password is incorrect")
      )
  }

  function connectSocket(token: string) {

    if (token) {
      const socket = io('http://34.65.97.206:8000/', { query: { token } }).connect();

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
//Register
  const onClickSignUp = () => {

    if (!username) {
      alert('Username field is empty')
      return;
    }
    if (!password) {
      alert('Password field is empty')
      return;
    }
    if (!firstName) {
      alert('First name field is empty')
      return;
    }
    if (!lastName) {
      alert('Last name field is empty')
      return;
    }
    let signUpRequestBody = {
      username,
      password,
      firstName,
      lastName,
    }

    axios.post<ILogin, AxiosResponse<IUser>>("http://34.65.97.206:3001/users/signup", signUpRequestBody)
      .then((response) => {

        if (!response.data.token) {
          alert("General error - Please talk to the manager");
          return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        let userDetails = {
          userToken: response.data.token,
          userType: response.data.userType,
          userId: response.data.userId
        }

        let savedUserDetails = JSON.stringify(userDetails);
        sessionStorage.setItem(`savedUserDetails`, savedUserDetails);
        dispatch({ type: ActionType.OnClickSignIn, payload: { token: response.data.token, userType: response.data.userType, userId: response.data.userId } });

        axios.get("http://34.65.97.206:3001/followedVacations")
        .then((response) => {
          let followedVacationsId = response.data
          dispatch({ type: ActionType.getAllFollowedVacations, payload: followedVacationsId })
        })

        handleClose();
        connectSocket(response.data.token);
      })
      .catch((error: any) =>
        alert(error.response.data.error + ", please pick a different user Name")
      )
  }


  function onRegisterClick() {
    //moving to register modal
    setRegisterClicked(true);

  }

  function onClickCancelRegister() {
    setRegisterClicked(false);
    handleClose();
  }

  function onClickLogout() {
    setRegisterClicked(false);
    sessionStorage.clear();
    dispatch({ type: ActionType.OnClickSignUp, payload: { userType: "" } })
    window.location.reload();
  }


  return (
    <div className="Loginmodal">
      <>
        {!currentUser.userType &&
          <Button className="loginButton" size="lg" variant="primary" onClick={handleShow}>
            Login
          </Button>}

        {currentUser.userType &&
          <Button className="logoutButton" size="lg" variant="primary" onClick={onClickLogout}>
            Logout
          </Button>}


        {!isRegisterClicked &&
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <ModalHeader>
              <ModalTitle>Login</ModalTitle>
              <Button variant="link" className="logUpButton" onClick={onRegisterClick}>Register here</Button>
            </ModalHeader>
            <ModalBody>
              <input className="loginInput" placeholder="Username" onChange={onUsernameChange} ></input>
              <input className="loginInput" type="password" placeholder="Password" onChange={onPasswordChange}></input>


            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="loginButton" onClick={login} variant="primary">Sign in</Button>
            </ModalFooter>
          </Modal>
        }
        {isRegisterClicked &&
          <Modal id="RegisterModal"
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <ModalHeader>
              <ModalTitle>Registration</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <input className="registerInput" placeholder="First name" onChange={onFirstNameChange}></input>
              <input className="registerInput" placeholder="Last name" onChange={onLastNameChange}></input>
              <input className="registerInput" placeholder="Username" onChange={onUsernameChange}></input>
              <input type="password" className="registerInput" placeholder="Password" onChange={onPasswordChange}></input>

            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={onClickCancelRegister}>
                Cancel
              </Button>
              <Button className="logupButton2" onClick={onClickSignUp} variant="primary">Sign up</Button>
            </ModalFooter>
          </Modal>
        }
      </>
    </div>
  );
}

