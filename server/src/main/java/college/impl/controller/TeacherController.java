package college.impl.controller;

import college.impl.dto.DepartmentDTO;
import college.impl.dto.TeacherDTO;
import college.impl.dto.response.StudentResponseDTO;
import college.impl.dto.response.TeacherCourseResponseDTO;
import college.impl.dto.response.TeacherUserResponseDTO;
import college.impl.entity.*;
import college.impl.service.CourseService;
import college.impl.service.DepartmentService;
import college.impl.service.TeacherService;
import college.impl.service.UserService;
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

@RestController
@RequestMapping("/api/Teachers")
@Validated
public class TeacherController {

    @Autowired
    TeacherService teacherService;

    @Autowired
    DepartmentService departmentService;

    @Autowired
    CourseService courseService;

    @Autowired
    UserService userService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Teacher> createTeacher(@Valid @RequestBody TeacherDTO teacherDTO) {
        Teacher createdTeacher = teacherService.create(entityFromDTO(new Teacher(), teacherDTO));

        return new ResponseEntity<>(createdTeacher, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TeacherUserResponseDTO>> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAll();

        return new ResponseEntity<>(teachers.stream().map(TeacherUserResponseDTO::new).toList(), HttpStatus.OK);
    }

    @GetMapping(value = "/{teacherId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TeacherCourseResponseDTO> getTeacherById(@PathVariable String teacherId, @RequestParam (required = false) String expand) {
        verifyExpand(expand);

        Teacher teacher = findExistingTeacher(teacherId);

        return new ResponseEntity<>(new TeacherCourseResponseDTO(teacher, assignedCourses(teacher)), HttpStatus.OK);
    }

    @GetMapping(params = "departmentId")
    public ResponseEntity<List<TeacherUserResponseDTO>> getTeachersByDepartmentId(@RequestParam String departmentId) {
        Department department = findExistingDepartment(departmentId);
        List<Teacher> teachers = teacherService.getByDepartment(department);

        return new ResponseEntity<>(teachers.stream().map(TeacherUserResponseDTO::new).toList(), HttpStatus.OK);
    }

    @GetMapping(params = "userId")
    public ResponseEntity<TeacherCourseResponseDTO> getTeacherByUserId(@RequestParam String userId, @RequestParam (required = false) String expand) {
        verifyExpand(expand);
        User user = findExistingUser(userId);

        Teacher teacher = teacherService.getByUser(user);

        if (Objects.isNull(teacher)) {
            throw new EntityNotFoundException("Teacher for the provided user id not found.");
        }

        return new ResponseEntity<>(new TeacherCourseResponseDTO(teacher, assignedCourses(teacher)), HttpStatus.OK);
    }

    @PatchMapping (value = "/{teacherId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TeacherUserResponseDTO> patchUpdateTeacher(@PathVariable String teacherId, @Valid @RequestBody TeacherDTO teacherDTO) {
        Teacher existingTeacher = findExistingTeacher(teacherId);

        Teacher updatedTeacher = teacherService.update(modifiedTeacher(existingTeacher, teacherDTO));
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Transactional
    @DeleteMapping(value = "/{teacherId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String teacherId) {
        Teacher teacher = findExistingTeacher(teacherId);

        teacherService.delete(teacher);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Teacher findExistingTeacher(String id) {
        Teacher teacher = teacherService.getById(id);

        if (Objects.isNull(teacher)) {
            throw new EntityNotFoundException("Teacher with the provided id not found.");
        }

        return teacher;
    }

    private Department findExistingDepartment(String id) {
        Department department = departmentService.getById(id);

        if (Objects.isNull(department)) {
            throw new EntityNotFoundException("Department with the provided id not found.");
        }

        return department;
    }

    private User findExistingUser(String id) {
        User user = userService.getById(id);

        if (Objects.isNull(user)) {
            throw new EntityNotFoundException("User with the provided id not found.");
        }

        return user;
    }

    private List<Course> assignedCourses(Teacher teacher) {
        return courseService.getByTeacher(teacher);
    }

    private Teacher entityFromDTO(Teacher teacher, TeacherDTO dto) {
        Department department = findExistingDepartment(dto.getDepartmentId());
        teacher.setDepartment(department);

       return teacher;
    }

    private boolean isToUnassignHeadTeacher(Teacher teacher, String departmentId) {
        if (Objects.isNull(teacher.getHeadOf())) {
            return false;
        }

        return !teacher.getHeadOf().getId().equals(departmentId);
    }

    private Teacher modifiedTeacher(Teacher teacher, TeacherDTO dto) {
        if (Objects.nonNull(dto.getDepartmentId())) {
            if (dto.getDepartmentId().isEmpty()) {
                teacher.setDepartment(null);
            } else {
                Department department = findExistingDepartment(dto.getDepartmentId());
                teacher.setDepartment(department);
            }
        }

        return teacher;
    }

    private void verifyExpand(String expand) {
        if (Objects.nonNull(expand)){
            if (!expand.equals("courses")) {
                throw new EntityNotFoundException("Resource with the provided URI not found");
            }
        }
    }
}
