package college.impl.dto;

import college.impl.helpers.PatchOp;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;


@JsonInclude
public class AssignmentDTO {
    @NotNull
    private String studentId;

    @NotNull
    private PatchOp op;

    public AssignmentDTO() {
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public PatchOp getOp() {
        return op;
    }

    public void setOp(PatchOp op) {
        this.op = op;
    }
}
