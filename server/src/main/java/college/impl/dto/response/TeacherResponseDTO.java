package college.impl.dto.response;

import college.impl.entity.Course;
import college.impl.entity.Teacher;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@JsonInclude
public class TeacherResponseDTO extends TeacherUserResponseDTO {
    private List<TeacherCourse> courses;

    public TeacherResponseDTO(Teacher teacher, List<Course> courses) {
        super(teacher);
        this.courses = Objects.nonNull(courses) ? courses.stream().map(TeacherCourse::new).toList() : Collections.emptyList();
    }

    public List<TeacherCourse> getCourses() {
        return courses;
    }

    public void setCourses(List<TeacherCourse> courses) {
        this.courses = courses;
    }

    private class TeacherCourse {
        private String id;
        private String name;

        protected TeacherCourse(Course course) {
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