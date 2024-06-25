package college.impl.repository;

import college.impl.entity.Course;
import college.impl.entity.Student;
import college.impl.entity.Teacher;
import college.impl.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findById(String id);

    Student findByUser(User user);
}
