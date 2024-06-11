package college.impl.service;

import college.impl.entity.User;
import college.impl.helpers.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import college.impl.repository.UserRepository;

import java.util.Objects;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void createUser(String username, String password, Role role) {
        String encodedPassword = new BCryptPasswordEncoder().encode(password);
        userRepository.save(new User(username, encodedPassword, role));
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
}