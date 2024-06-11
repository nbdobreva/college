package college.impl.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


@JsonInclude
public class CollegeDTO {
    @NotNull(message = "The \"name\" attribute is mandatory")
    private String name;
    private String address;

    public CollegeDTO() {
    }

    public String getName() {
        return this.name;
    }

    public String getAddress() {
        return this.address;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
