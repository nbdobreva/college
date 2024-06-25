package college.impl.controller;

import college.impl.dto.UserDTO;
import college.impl.entity.Student;
import college.impl.entity.Teacher;
import college.impl.entity.User;
import college.impl.helpers.Role;
import college.impl.service.StudentService;
import college.impl.service.TeacherService;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import college.impl.service.UserService;

import java.util.Objects;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StudentService studentService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginUser) {
        User user = userService.findByUsername(loginUser.getUsername());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserDTO registration) {
        validateRegistration(registration);
        User createdUser = userService.createUser(entityFromDTO(registration));

        if (Objects.nonNull(createdUser.getRole())) {
            handleRoleAssignment(createdUser);
        }

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    private void handleRoleAssignment(User user) {
        if (user.getRole().equals(Role.TEACHER)) {
            Teacher teacher = new Teacher();
            teacher.setUser(user);
            teacherService.create(teacher);
        }

        if (user.getRole().equals(Role.STUDENT)) {
            Student student = new Student();
            student.setUser(user);
            studentService.create(student);
        }
    }

    public void validateRegistration(UserDTO registration) {
        if (StringUtils.isBlank(registration.getFirstName())) {
            throw new IllegalArgumentException("First name is not provided");
        }
        if (StringUtils.isBlank(registration.getLastName())) {
            throw new IllegalArgumentException("Last name is not provided");
        }
    }

    private User entityFromDTO(UserDTO dto) {
       User user = new User();
       user.setFirstName(dto.getFirstName());
       user.setLastName(dto.getLastName());

       if (Objects.nonNull(dto.getRole())) {
           user.setRole(dto.getRole());
       }

       return user;
    }
}
