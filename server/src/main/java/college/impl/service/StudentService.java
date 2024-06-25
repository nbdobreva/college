package college.impl.service;

import college.impl.entity.*;
import college.impl.repository.StudentRepository;
import college.impl.repository.TeacherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student create(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public Student getById(String id) {
        return studentRepository.findById(id);
    }

    public Student update(Student student) {
        return studentRepository.saveAndFlush(student);
    }

    public void delete(Student student) {
        studentRepository.delete(student);
    }

    public Student getByUser(User user) {
        return studentRepository.findByUser(user);
    }
}