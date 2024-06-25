package college.impl.service;

import college.impl.entity.Course;
import college.impl.entity.Department;
import college.impl.entity.Student;
import college.impl.entity.Teacher;
import college.impl.repository.CourseRepository;
import college.impl.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course create(Course course) {
        return courseRepository.save(course);
    }

    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    public Course getById(String id) {
        return courseRepository.findAllById(id);
    }

    public Course update(Course course) {
        return courseRepository.saveAndFlush(course);
    }

    @Transactional
    public void delete(Course course) {
        courseRepository.delete(course);
    }

    public List<Course> getByDepartment(Department department) {
        return courseRepository.findByDepartment(department);
    }

    public List<Course> getByTeacher(Teacher teacher) {
        return courseRepository.findByTeacher(teacher);
    }
}