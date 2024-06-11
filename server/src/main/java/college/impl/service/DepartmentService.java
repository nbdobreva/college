package college.impl.service;

import college.impl.entity.Department;
import college.impl.entity.Faculty;
import college.impl.repository.DepartmentRepository;
import college.impl.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public Department create(Department faculty) {
        return departmentRepository.save(faculty);
    }

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public Department getById(String id) {
        return departmentRepository.findAllById(id);
    }

    public Department update(Department department) {
        return departmentRepository.saveAndFlush(department);
    }

    public void delete(Department department) {
        departmentRepository.delete(department);
    }
}