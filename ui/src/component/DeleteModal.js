import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/DeleteModal.css';


const DeleteModal = ({ showModal, onClose, deleteEntity, deleteText }) => {

    return (
        showModal && (
            <div className="delete-modal-overlay">
                <div className="delete-modal">
                    <div className="delete-close-button" onClick={() => onClose()}>
                        <i className="bi bi-x" />
                    </div>
                    <div>
                        <p className="delete-text">{deleteText}</p>
                        <p className="delete-text-confirm"> Are you sure you want to proceed?</p>
                    </div>
                    <div className="delete-button">
                        <button
                            className="delete"
                            onClick={deleteEntity}>DELETE
                        </button>
                    </div>
                </div >
            </div >
        )
    );
};

export default DeleteModal;
