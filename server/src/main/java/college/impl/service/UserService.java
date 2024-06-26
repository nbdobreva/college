package college.impl.service;

import college.impl.dto.UserDTO;
import college.impl.entity.Teacher;
import college.impl.entity.User;
import college.impl.helpers.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import college.impl.repository.UserRepository;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(User user) {
        String username = generateUniqueUsername(user.getFirstName(), user.getLastName());
        user.setUsername(generateUniqueUsername(user.getFirstName(), user.getLastName()));

        String encodedPassword = new BCryptPasswordEncoder().encode(generatePassword(username));
        user.setPassword(encodedPassword);

        user.setEmail(generateEmail(user.getFirstName(), user.getLastName()));
        return userRepository.save(user);
    }

    private String generateUniqueUsername(String firstName, String lastName) {
        String baseUsername = (firstName.substring(0,1) + lastName).toLowerCase();
        String username = baseUsername;
        int counter = 0;

        while (Objects.nonNull(userRepository.findByUsername(username))) {
            counter++;
            if (counter < 10){
                username = baseUsername + "0" + counter;
            } else {
                username = baseUsername + counter;
            }
        }

        return username;
    }

    private String generateEmail(String firstName, String lastName) {
        String baseEmail = firstName.toLowerCase() + "." +lastName.toLowerCase() + "@college.com";
        String email = baseEmail;
        int counter = 0;

        while (Objects.nonNull(userRepository.findByEmail(email))) {
            counter++;
            if (counter < 10){
                email = baseEmail + "0" + counter;
            } else {
                email = baseEmail + counter;
            }
        }

        return email;
    }

    private String generatePassword(String username) {
        return username.concat("!");
    }

    public UserDetails userDetailsForAuthentication(String username) {
        User user = findByUsername(username);

        if (Objects.isNull(user)) {
            throw new UsernameNotFoundException("User with username: " + username + " not found");
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().toString())
                .build();
    }

    public User getById(String id) {
        return userRepository.findById(id);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User update(User user) {
        return userRepository.saveAndFlush(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

}