package college.impl.repository;

import college.impl.entity.Department;
import college.impl.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findAllById(String id);
}
