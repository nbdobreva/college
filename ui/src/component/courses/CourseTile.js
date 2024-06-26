import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/course/CourseTile.css'

const CourseTile = ({ course }) => {
    console.log("in courses");

    return (
        <div key={course.id} className="course-tile">
            <div className="course-content">
                <div className="color-square"></div>
                <div className="course">
                    <Link to={`/courses/${course.id}`}>
                        <h3 className='course-name'>
                            {course.name}
                        </h3>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseTile;