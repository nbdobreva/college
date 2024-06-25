package college.impl.dto.response;

import college.impl.dto.CourseDTO;
import college.impl.entity.Course;
import college.impl.entity.Department;
import college.impl.entity.Faculty;
import college.impl.entity.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Objects;


@JsonInclude
public class CourseResponseDTO {
    private String id;
    private String name;
    private String description;
    private CourseDepartment department;
    private CourseTeacher teacher;

    public CourseResponseDTO(Course course) {
        this.id = course.getId();
        this.name = course.getName();
        this.description = course.getDescription();
        this.department = new CourseDepartment(course.getDepartment());

        if (Objects.nonNull(course.getTeacher())) {
            this.teacher = new CourseTeacher(course.getTeacher());

        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CourseDepartment getDepartment() {
        return department;
    }

    public void setDepartment(CourseDepartment department) {
        this.department = department;
    }

    public CourseTeacher getTeacher() {
        return teacher;
    }

    public void setTeacher(CourseTeacher teacher) {
        this.teacher = teacher;
    }

    private class CourseDepartment {
        private String id;
        private String name;

        protected CourseDepartment(Department department) {
            this.id = department.getId();
            this.name = department.getName();
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    private class CourseTeacher {
        private String id;
        private String firstName;
        private String lastName;
        private String userId;


        protected CourseTeacher(Teacher teacher) {
            this.id = teacher.getId();
            this.firstName = teacher.getUser().getFirstName();
            this.lastName = teacher.getUser().getLastName();
            this.userId = teacher.getUser().getId();
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
}
