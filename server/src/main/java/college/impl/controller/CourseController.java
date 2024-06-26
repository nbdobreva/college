package college.impl.controller;

import college.impl.dto.AssignmentDTO;
import college.impl.dto.CourseDTO;
import college.impl.dto.DepartmentDTO;
import college.impl.dto.response.CourseResponseDTO;
import college.impl.dto.response.StudentUserResponseDTO;
import college.impl.dto.response.TeacherUserResponseDTO;
import college.impl.entity.*;
import college.impl.helpers.PatchOp;
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

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Courses")
@Validated
public class CourseController {

    @Autowired
    CourseService courseService;

    @Autowired
    DepartmentService departmentService;

    @Autowired
    TeacherService teacherService;

    @Autowired
    StudentService studentService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponseDTO createCourse(@Valid @RequestBody CourseDTO courseDTO) {
        Course createdCourse = courseService.create(entityFromDTO(new Course(), courseDTO));

        return new CourseResponseDTO(createdCourse);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<CourseResponseDTO> getAllCourses() {
        List<Course> courses = courseService.getAll();

        return courses.stream().map(CourseResponseDTO::new).toList();
    }

    @GetMapping(value = "/{courseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public CourseResponseDTO getCourseById(@PathVariable String courseId) {
        Course course = courseService.getById(courseId);

        return new CourseResponseDTO(course);
    }

    @GetMapping(params = "departmentId")
    @ResponseStatus(HttpStatus.OK)
    public List<CourseResponseDTO> getCoursesByDepartmentId(@RequestParam String departmentId) {
        Department department = findExistingDepartment(departmentId);
        List<Course> courses = courseService.getByDepartment(department);

        return courses.stream().map(CourseResponseDTO::new).toList();
    }

    @GetMapping("/{courseId}/students")
    @ResponseStatus(HttpStatus.OK)
    public List<StudentUserResponseDTO>getStudentsByCourseId(@PathVariable String courseId) {
        Course course = findExistingCourse(courseId);
       List<Student> assignedStudents = course.getStudents();


        return assignedStudents.stream().map(StudentUserResponseDTO::new).toList();
    }

    @PatchMapping(value="/{courseId}/students", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<StudentUserResponseDTO>> assignStudentToCourse(
            @PathVariable String courseId,
            @Valid @RequestBody AssignmentDTO assignmentDTO) {
        validatePatchBody(assignmentDTO);

        Course course = findExistingCourse(courseId);
        Student student = findExistingStudent(assignmentDTO.getStudentId());

        if (assignmentDTO.getOp().equals(PatchOp.ADD)) {
            course.getStudents().add(student);
            student.getCourses().add(course);
        }

        if (assignmentDTO.getOp().equals(PatchOp.REMOVE)) {
            course.getStudents().remove(student);
            student.getCourses().remove(course);
        }

        courseService.update(course);
        studentService.update(student);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping (value = "/{courseId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CourseResponseDTO> patchUpdateCourse(@PathVariable String courseId, @Valid @RequestBody CourseDTO courseDTO) {
        Course existingCourse = findExistingCourse(courseId);
        Course updatedCourse = courseService.update(modifiedCourse(existingCourse,courseDTO));

        return new ResponseEntity<>(new CourseResponseDTO(updatedCourse), HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String courseId) {
        Course course = findExistingCourse(courseId);

        courseService.delete(course);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Course findExistingCourse(String id) {
        Course course = courseService.getById(id);

        if (Objects.isNull(course)) {
            throw new EntityNotFoundException("Course with the provided id not found.");
        }

        return course;
    }

    private Department findExistingDepartment(String id) {
        Department department = departmentService.getById(id);

        if (Objects.isNull(department)) {
            throw new EntityNotFoundException("Department with the provided id not found.");
        }

        return department;
    }

    private Student findExistingStudent(String id) {
        Student student = studentService.getById(id);

        if (Objects.isNull(student)) {
            throw new IllegalArgumentException("Student with the provided id not found.");
        }

        return student;
    }

    private Course entityFromDTO(Course course, CourseDTO dto) {
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        Department department = findExistingDepartment(dto.getDepartmentId());
        course.setDepartment(department);

        Teacher teacher = null;
        if (Objects.nonNull(dto.getTeacherId())) {
            teacher = teacherService.getById(dto.getTeacherId());
        }
        course.setTeacher(teacher);

        return course;
    }

    private Course modifiedCourse(Course course, CourseDTO dto) {
        if (Objects.nonNull(dto.getName())) {
            course.setName(dto.getName());
        }

        if (Objects.nonNull(dto.getDescription())) {
            course.setDescription(dto.getDescription());
        }

        if (Objects.nonNull(dto.getTeacherId())) {
            Teacher teacher = teacherService.getById(dto.getTeacherId());
            course.setTeacher(teacher);
        }

        return course;
    }

    private void validatePatchBody(AssignmentDTO body) {
        if (Objects.isNull(body.getStudentId())) {
            throw new IllegalArgumentException("Student id for assignment is not provided.");
        }

        if (Objects.isNull((body.getOp())) || (!body.getOp().equals(PatchOp.ADD) && !body.getOp().equals(PatchOp.REMOVE))) {
            throw new IllegalArgumentException("Patch operation is not provided.");
        }
    }

}
