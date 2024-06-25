import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/department/DepartmentTile.css'

const DepartmentTile = ({ department }) => {

    return (
        <div key={department.id} className="department-tile">
            <div className="department-header" />
            <div className="department">
                <Link to={`/departments/${department.id}`}>
                    <h3 className='department-name'>
                        {department.name}
                    </h3>
                </Link>
            </div>
        </div>
    );
};

export default DepartmentTile;