package college.impl.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;


@JsonInclude
public class StudentDTO {
    @NotNull(message = "The \"userId\" attribute is mandatory")
    private String userId;

    public StudentDTO() {
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
