import { Button, ModalBody, ModalFooter, ModalTitle } from "react-bootstrap";
import "./AddVacationModal.css";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ChangeEvent, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from "react-redux";
import { ActionType } from "../../redux/action-type";
import axios from "axios";


export default function AddVacationModal() {

  let dispatch = useDispatch()

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  let [vacationDestination, setVacationDestination] = useState("");
  let [price, setPrice] = useState("");
  let [img, setImage] = useState("");
  let [startDate, setstartDate] = useState("");
  let [endDate, setendDate] = useState("");
  let [file, setFile] = useState();
  let [fileName, setFileName] = useState("");

  let onVacationDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVacationDestination(event.target.value);
  }

  let onPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  }

  let onStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {

    setstartDate(event.target.value);
  }
  let onEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setendDate(event.target.value);
  }

  let saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setImage(`http://34.65.97.206:3001/${fileName}`)
    uploadFile();
  };

  const uploadFile = async () => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    setImage(`http://34.65.97.206:3001/${fileName}`)
    try {
      const res = await axios.post(
        "http://34.65.97.206:3001/files/upload",
        formData
      );
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };


  function onClickAddVacation() {

    if (!vacationDestination) {
      alert('Destination field is empty');
      return;
    }

    if (!price) {
      alert('Price field is empty');
      return;
    }
    if (!img) {
      alert('You must upload an image');
      return;
    }
    if (!startDate) {
      alert('Start date field is empty');
      return;
    }
    if (!endDate) {
      alert('End date field is empty');
      return;
    }
    let newVacation = {
      vacationDestination,
      price,
      img: `http://34.65.97.206:3001/${fileName}`,
      startDate,
      endDate
    }


    axios.post("http://34.65.97.206:3001/vacations/", newVacation)
      .then((response) => {
        dispatch({ type: ActionType.AddVacation, payload: { vacationId: response.data, vacationDestination, price, img, startDate, endDate } })
      })
      .catch((error: any) => alert("Something went wrong , please contact the system manager"))

    handleClose();

  }

  function onClickCancel() {
    handleClose();
  }

  return (

    <>
      <Button className="add-vacation" size="lg" id="btn-add" onClick={handleShow}>Add vacation</Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader>
          <ModalTitle>Add Vacation</ModalTitle>
        </ModalHeader>
        <ModalBody className="modalBody">
          <input placeholder="destination" className="addInput" onChange={onVacationDestinationChange} ></input>
          <input type="number" placeholder="price" className="addInput" onChange={onPriceChange}></input>

          <input type="date" placeholder="start date" className="addInput" onChange={onStartDateChange}></input>
          <input type="date" placeholder="end date" className="addInput" onChange={onEndDateChange}></input>

          <input type="file" className="btnFile" id="file-upload-button" onChange={saveFile} />
          <input type="submit" className="btnSubmit" onClick={uploadFile} />


        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClickCancel}>
            Cancel
          </Button>
          <Button onClick={onClickAddVacation} variant="primary">Save</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

