package college.impl.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;


@JsonInclude
public class FacultyDTO {
    @NotNull(message = "The \"name\" attribute is mandatory")
    private String name;

    @NotNull(message = "The \"collegeID\" attribute is mandatory")
    private String collegeId;

    public FacultyDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(String collegeId) {
        this.collegeId = collegeId;
    }
}
