import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/course/MyCourseTile.css'

const MyCourseTile = ({ course }) => {

    return (
        <div key={course.id} className="my-course-tile">
            <div className="my-course-header" />
            <div className="my-course">
                <Link to={`/courses/${course.id}`}>
                    <h3 className='my-course-name'>
                        {course.name}
                    </h3>
                </Link>
            </div>
        </div>
    );
};

export default MyCourseTile;