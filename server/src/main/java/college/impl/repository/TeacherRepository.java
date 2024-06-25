package college.impl.repository;

import college.impl.entity.Department;
import college.impl.entity.Teacher;
import college.impl.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Teacher findById(String id);

    List<Teacher> findByDepartment(Department department);

    Teacher findByUser(User user);
}
