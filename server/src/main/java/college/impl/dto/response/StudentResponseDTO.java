package college.impl.dto.response;

import college.impl.dto.CourseDTO;
import college.impl.entity.Course;
import college.impl.entity.Department;
import college.impl.entity.Student;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude
public class StudentResponseDTO extends StudentUserResponseDTO {
    private List<StudentCourse> courses;

    public StudentResponseDTO(Student student) {
       super(student);
        this.courses = student.getCourses().stream().map(StudentCourse::new).toList();
    }

    public List<StudentCourse> getCourses() {
        return courses;
    }

    public void setCourses(List<StudentCourse> courses) {
        this.courses = courses;
    }

    private class StudentCourse {
        private String id;
        private String name;

        public StudentCourse(Course course) {
            this.id = course.getId();
            this.name = course.getName();
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