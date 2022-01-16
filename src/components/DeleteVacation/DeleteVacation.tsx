import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, ModalFooter, ModalTitle, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { IVacation } from '../../Models/IVacation';
import { ActionType } from '../../redux/action-type';

import './DeleteVacation.css';

export default function DeleteVacation(props: IVacation) {
    let [show, setShow] = useState(false);
    let handleClose = () => setShow(false);
    let handleShow = () => setShow(true);
    let dispatch = useDispatch()

    let deleteVacation = () => {
        axios.delete(`http://34.65.97.206:3001/vacations/${props.vacationId}`)
            .then((response) => {
                dispatch({ type: ActionType.DeleteVacation, payload: { vacationId: props.vacationId } });
                handleClose();
            })
            .catch((error: any) =>
                toast.error(`${error.response.data.error}`)
            )
    };

    return (
        <><>
            <OverlayTrigger placement="right" overlay={<Tooltip id={`tooltip`}>Delete vacation</Tooltip>}>
                <Button className="delete-vacation" size="sm" onClick={handleShow} variant="danger">X</Button>
            </OverlayTrigger>
        </><Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} animation={false} centered>
                <ModalHeader>
                    <ModalTitle>Are you sure you want to delete this vacation?</ModalTitle>
                </ModalHeader>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={deleteVacation}>Confirm</Button>
                </ModalFooter>
            </Modal></>
    );
}
