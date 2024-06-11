package college.impl.dto;

import college.impl.entity.College;
import college.impl.entity.Course;
import college.impl.entity.Faculty;
import college.impl.entity.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;


@JsonInclude
public class DepartmentDTO {
    @NotNull(message = "The \"name\" attribute is mandatory")
    private String name;
    @NotNull(message = "The \"facultyId\" attribute is mandatory")
    private String facultyId;
    private String headId;

    public DepartmentDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(String facultyId) {
        this.facultyId = facultyId;
    }

    public String getHeadId() {
        return headId;
    }

    public void setHeadId(String headId) {
        this.headId = headId;
    }
}
