package college.impl.dto.response;

import college.impl.entity.Department;
import college.impl.entity.Student;
import college.impl.entity.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Objects;

@JsonInclude
public class StudentUserResponseDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String userId;

    public StudentUserResponseDTO(Student student) {
        this.id = student.getId();
        this.firstName = student.getUser().getFirstName();
        this.lastName = student.getUser().getLastName();
        this.userId = student.getUser().getId();
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