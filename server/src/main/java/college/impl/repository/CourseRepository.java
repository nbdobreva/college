package college.impl.repository;

import college.impl.entity.Course;
import college.impl.entity.Department;
import college.impl.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findAllById(String id);

    List<Course> findByDepartment(Department department);

    List<Course> findByTeacher(Teacher teacher);
}
