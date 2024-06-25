package college.impl.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;


@JsonInclude
public class AssignmentDTO {
    @NotNull
    private String studentId;

    public AssignmentDTO() {
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}
