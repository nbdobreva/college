package college.impl.controller;

import college.impl.dto.CourseDTO;
import college.impl.dto.StudentDTO;
import college.impl.dto.TeacherDTO;
import college.impl.dto.response.StudentResponseDTO;
import college.impl.dto.response.StudentUserResponseDTO;
import college.impl.dto.response.TeacherUserResponseDTO;
import college.impl.entity.*;
import college.impl.service.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/Students")
@Validated
public class StudentController {

    @Autowired
    StudentService studentService;

    @Autowired
    CourseService courseService;

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        List<Student> students = studentService.getAll();

        return new ResponseEntity<>(students.stream().map(StudentResponseDTO::new).toList(), HttpStatus.OK);
    }

    @GetMapping(value = "/{studentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable String studentId) {
        Student student = studentService.getById(studentId);

        return new ResponseEntity<>(new StudentResponseDTO(student), HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<StudentResponseDTO> getStudentByUserId(@RequestParam String userId) {
        User user = findExistingUser(userId);

        Student student = studentService.getByUser(user);

        if (Objects.isNull(student)) {
            throw new EntityNotFoundException("Student for the provided user id not found.");
        }

        return new ResponseEntity<>(new StudentResponseDTO(student), HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/{studentId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String studentId) {
        Student student = findExistingStudent(studentId);

        studentService.delete(student);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Student findExistingStudent(String id) {
        Student student = studentService.getById(id);

        if (Objects.isNull(student)) {
            throw new EntityNotFoundException("Student with the provided id not found.");
        }

        return student;
    }

    private Course findExistingCourse(String id) {
        Course course = courseService.getById(id);

        if (Objects.isNull(course)) {
            throw new EntityNotFoundException("Course with the provided id not found.");
        }

        return course;
    }

    private User findExistingUser(String id) {
        User user = userService.getById(id);

        if (Objects.isNull(user)) {
            throw new EntityNotFoundException("User with the provided id not found.");
        }

        return user;
    }
}
