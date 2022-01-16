import React, { useState } from 'react';
import { OverlayTrigger, Tooltip, Button, Modal, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import Graphs from '../Graphs/Graphs';
import './Reports.css';

export default function Reports() {
    let [show, setShow] = useState(false);
    let handleClose = () => setShow(false);
    let handleShow = () => setShow(true);

    return (
        <>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip`}>All the information you need</Tooltip>}>
                <Button className="btn btn-primary btn-lg" id="reports" onClick={handleShow} >Reports</Button>
            </OverlayTrigger><Modal className="reports-modal" show={show} onHide={handleClose} backdrop="static" keyboard={false} animation={false} centered>
                <ModalHeader>
                    <ModalTitle>Reports</ModalTitle>

                </ModalHeader>
                <ModalBody>
                    <Graphs />
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
