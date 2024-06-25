package college.impl.service;

import college.impl.entity.Department;
import college.impl.entity.Teacher;
import college.impl.entity.User;
import college.impl.repository.CourseRepository;
import college.impl.repository.DepartmentRepository;
import college.impl.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    public Teacher create(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public List<Teacher> getAll() {
        return teacherRepository.findAll();
    }

    public Teacher getById(String id) {
        return teacherRepository.findById(id);
    }

    public Teacher update(Teacher teacher) {
        return teacherRepository.saveAndFlush(teacher);
    }

    public void delete(Teacher teacher) {
        teacherRepository.delete(teacher);
    }

    public List<Teacher> getByDepartment(Department department) {
        return teacherRepository.findByDepartment(department);
    }

    public Teacher getByUser(User user) {
        return teacherRepository.findByUser(user);
    }
}