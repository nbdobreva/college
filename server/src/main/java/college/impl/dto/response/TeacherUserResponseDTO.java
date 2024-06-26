package college.impl.dto.response;

import college.impl.entity.Department;
import college.impl.entity.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Objects;

@JsonInclude
public class TeacherUserResponseDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String userId;
    private TeacherDepartment department;
    private String headOfDepartment;

    public TeacherUserResponseDTO(Teacher teacher) {
        this.id = teacher.getId();
        if (Objects.nonNull(teacher.getDepartment())) {
            this.department = new TeacherDepartment(teacher.getDepartment());
        }
        if (Objects.nonNull(teacher.getHeadOf())) {
            this.headOfDepartment = teacher.getHeadOf().getId();
        }
        this.firstName = teacher.getUser().getFirstName();
        this.lastName = teacher.getUser().getLastName();
        this.email = teacher.getUser().getEmail();
        this.userId = teacher.getUser().getId();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TeacherDepartment getDepartment() {
        return department;
    }

    public void setDepartment(TeacherDepartment department) {
        this.department = department;
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

    public String getHeadOfDepartment() {
        return headOfDepartment;
    }

    public void setHeadOfDepartment(String headOfDepartment) {
        this.headOfDepartment = headOfDepartment;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private class TeacherDepartment {
        private String id;
        private String name;

        protected TeacherDepartment(Department department) {
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
}