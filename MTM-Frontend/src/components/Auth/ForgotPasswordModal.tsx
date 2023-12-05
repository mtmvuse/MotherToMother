import React from "react";
import { Modal, Backdrop } from "@mui/material";
import "./ForgotPasswordModal.css";

type propTypes = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const ForgotPasswordModal: React.FC<propTypes> = ({ open, onClose, children }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            BackdropComponent={Backdrop}
            BackdropProps={{ onClick: () => {} }}
        >
            <div className="modal">
                {children}
            </div>
        </Modal>
    );
};

export default ForgotPasswordModal;
