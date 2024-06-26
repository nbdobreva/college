package college.impl.controller;

import college.impl.dto.TeacherDTO;
import college.impl.dto.response.TeacherResponseDTO;
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

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<TeacherResponseDTO> getAllTeachers(
            @RequestParam(required = false) String departmentId,
            @RequestParam(required = false) String expand) {

        List<Teacher> teachers = isRequestParamPresent(departmentId) ?
                teacherService.getByDepartment(findExistingDepartment(departmentId)) :
                teacherService.getAll();

        return teachers.stream()
                .map(teacher -> isRequestParamPresent(expand) ?
                        new TeacherResponseDTO(teacher, assignedCourses(teacher)) :
                        new TeacherResponseDTO(teacher, null))
                .toList();
    }

    @GetMapping(value = "/{teacherId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public TeacherResponseDTO getTeacherById(
            @PathVariable String teacherId,
            @RequestParam (required = false) String expand) {

        Teacher teacher = findExistingTeacher(teacherId);

        return isRequestParamPresent(expand) ? new TeacherResponseDTO(teacher, assignedCourses(teacher)) : new TeacherResponseDTO(teacher, null);
    }


    @GetMapping(params = "userId")
    @ResponseStatus(HttpStatus.OK)
    public TeacherResponseDTO getTeacherByUserId(
            @RequestParam String userId, @RequestParam (required = false) String expand) {
        User user = findExistingUser(userId);

        Teacher teacher = findExistingTeacherByUser(user);

        return isRequestParamPresent(expand) ? new TeacherResponseDTO(teacher, assignedCourses(teacher)) : new TeacherResponseDTO(teacher, null);
    }

    @PatchMapping (value = "/{teacherId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void patchUpdateTeacher(@PathVariable String teacherId, @Valid @RequestBody TeacherDTO teacherDTO) {
        Teacher existingTeacher = findExistingTeacher(teacherId);

        Teacher updatedTeacher = teacherService.update(modifiedTeacher(existingTeacher, teacherDTO));
    }

    @Transactional
    @DeleteMapping(value = "/{teacherId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable String teacherId) {
        Teacher teacher = findExistingTeacher(teacherId);

        teacherService.delete(teacher);
    }

    private Teacher findExistingTeacher(String id) {
        Teacher teacher = teacherService.getById(id);

        if (Objects.isNull(teacher)) {
            throw new EntityNotFoundException("Teacher with the provided id not found.");
        }

        return teacher;
    }

    private Teacher findExistingTeacherByUser(User user) {
        Teacher teacher = teacherService.getByUser(user);

        if (Objects.isNull(teacher)) {
            throw new EntityNotFoundException("Teacher for provided not found.");
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

    private boolean isRequestParamPresent(String param) {
        return Objects.nonNull(param);
    }
}
