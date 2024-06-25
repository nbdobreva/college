import React, { useEffect } from "react";
import { useAuth } from '../../context/AuthContext';

import '../../styles/ModeratorMenu.css'

const ModeratorMenu = ({ openEdit, openDelete }) => {
    return (
        <div className="moderator-menu-container">
            <div className="moderator-tab">
                <div className="moderator-menu" onClick={openEdit}><i class="bi bi-pencil moderator-icon" /> Edit </div>
                <div className="moderator-menu" onClick={openDelete}><i class="bi bi-x-lg moderator-icon" />Delete</div>
            </div>
        </div>
    )
}

export default ModeratorMenu;