package college.impl.controller;

import college.impl.dto.StudentDTO;
import college.impl.dto.TeacherDTO;
import college.impl.dto.UserDTO;
import college.impl.entity.Department;
import college.impl.entity.Student;
import college.impl.entity.Teacher;
import college.impl.entity.User;
import college.impl.service.StudentService;
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

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/Users")
@Validated
public class UsersController {

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAll();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping(value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = findExistingUser(userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PatchMapping(value = "/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> updateUser(@PathVariable String userId, @Valid @RequestBody UserDTO userDTO) {
        User user = findExistingUser(userId);

        User patchedUser = userService.update(modifiedUser(user, userDTO));
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        User user = findExistingUser(userId);

        userService.delete(user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private User findExistingUser(String id) {
        User user = userService.getById(id);

        if (Objects.isNull(user)) {
            throw new EntityNotFoundException("User with the provided id not found.");
        }

        return user;
    }

    private User modifiedUser(User user, UserDTO dto) {
        if (Objects.nonNull(dto.getFirstName())) {
            user.setFirstName(dto.getFirstName());
        }

        if (Objects.nonNull(dto.getLastName())) {
            user.setLastName(dto.getLastName());
        }

        if (Objects.nonNull(dto.getRole())) {
            user.setRole(dto.getRole());
        }

        return user;
    }
}
