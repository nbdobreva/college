package college.impl.repository;

import college.impl.entity.Department;
import college.impl.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findAllById(String id);

    List<Department> findByFaculty(Faculty faculty);
}
