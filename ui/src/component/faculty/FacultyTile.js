import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/faculty/FacultyTile.css'

const FacultyTile = ({ faculty }) => {

    return (
        <div key={faculty.id} className="faculty-tile">
            <div className="faculty-header" />
            <div className="faculty">
                <Link to={`/faculties/${faculty.id}`}>
                    <h3 className='faculty-name'>
                        {faculty.name}
                    </h3>
                </Link>
            </div>
        </div>
    );
};

export default FacultyTile;