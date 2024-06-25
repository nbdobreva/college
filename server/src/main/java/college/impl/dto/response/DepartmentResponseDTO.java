package college.impl.dto.response;

import college.impl.entity.Department;
import college.impl.entity.Faculty;
import college.impl.entity.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Objects;


@JsonInclude
public class DepartmentResponseDTO {
    private String id;
    private String name;
    private String description;
    private DepartmentFaculty faculty;
    private DepartmentHead headTeacher;

    public DepartmentResponseDTO(Department department) {
        this.id = department.getId();
        this.name = department.getName();
        this.description = department.getDescription();
        this.faculty = new DepartmentFaculty(department.getFaculty());

        if (Objects.nonNull(department.getHead())) {
            this.headTeacher = new DepartmentHead(department.getHead());

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

    public DepartmentFaculty getFaculty() {
        return faculty;
    }

    public void setFaculty(DepartmentFaculty faculty) {
        this.faculty = faculty;
    }

    public DepartmentHead getHeadTeacher() {
        return headTeacher;
    }

    public void setHeadTeacher(DepartmentHead headTeacher) {
        this.headTeacher = headTeacher;
    }

    private class DepartmentFaculty {
        private String id;
        private String name;

        protected DepartmentFaculty(Faculty faculty) {
            this.id = faculty.getId();
            this.name = faculty.getName();
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

    private class DepartmentHead {
        private String id;
        private String firstName;
        private String lastName;
        private String userId;


        protected DepartmentHead(Teacher teacher) {
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
