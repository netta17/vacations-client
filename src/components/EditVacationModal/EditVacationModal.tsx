

import { Button, ModalBody, ModalFooter, ModalTitle, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./EditVacationModal.css";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ChangeEvent, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from "react-redux";
import { ActionType } from "../../redux/action-type";
import { IVacation } from "../../Models/IVacation";
import axios from "axios";
import { toast } from 'react-toastify';



export default function EditVacationModal(props: IVacation) {

    let dispatch = useDispatch()

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    let [file, setFile] = useState();
    let [fileName, setFileName] = useState("");

    let [destination, setDestination] = useState(`${props.vacationDestination}`);
    let [price, setPrice] = useState(`${props.price}`);
    let [img, setImg] = useState(`${props.img}`)
    let [startDate, setstartDate] = useState(`${props.startDate}`);
    let [endDate, setendDate] = useState(`${props.endDate}`);

    let onDestinationChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDestination(event.target.value);
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
        setImg(`http://34.65.97.206:3001/${e.target.files[0].name}`)
    };

    const uploadFile = async () => {

        let formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        setImg(`http://34.65.97.206:3001/${fileName}`)
        try {
            const res = await axios.post(
                "http://34.65.97.206:3001/files/upload",
                formData
            );
        } catch (ex) {
            console.log(ex);
        }
    };

    function onClickEditVacation() {

        if (!destination) {
            alert('Destination field is empty');
            return;
        }

        if (!price) {
            alert('Price field is empty');
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
        if (!img) {
            alert('You must upload an image');
            return;
        }

        let updatedVacation = {
            vacationDestination: destination,
            price,
            img,
            startDate,
            endDate,
            vacationId: props.vacationId
        }


        axios.put("http://34.65.97.206:3001/vacations/", updatedVacation)
            .then((response) => {
                dispatch({ type: ActionType.EditVacation, payload: { vacationDestination: destination, price, img: img, startDate, endDate, vacationId: props.vacationId } })
                handleClose()
            })
            .catch((error: any) => toast.error(`${error.response.data.error}`))
    }

    function onClickCancel() {
        handleClose();
    }


    return (

        <>
            <OverlayTrigger placement="right" overlay={<Tooltip id={`tooltip`}>
                Edit vacation
            </Tooltip>}>
                <Button className="edit-vacation" size="sm" id="btn-edit" onClick={handleShow}>✏️</Button>
            </OverlayTrigger>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader>
                    <ModalTitle>Edit Vacation</ModalTitle>
                </ModalHeader>
                <ModalBody className="modalBody">
                    <input placeholder="destination" className="editInput" defaultValue={props.vacationDestination} onChange={onDestinationChange} ></input>
                    <input type="number" placeholder="price" className="editInput" defaultValue={props.price} onChange={onPriceChange}></input>
                    <input type="date" placeholder="start date" className="editInput" defaultValue={props.startDate} onChange={onStartDateChange}></input>
                    <input type="date" placeholder="end date" className="editInput" defaultValue={props.endDate} onChange={onEndDateChange}></input>
                    <input type="file" className="btnFile" onChange={saveFile} />
                    <input type="submit" className="btnSubmit" onClick={uploadFile} />

                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={onClickCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onClickEditVacation} variant="primary">Save</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

