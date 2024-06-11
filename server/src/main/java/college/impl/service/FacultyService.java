package college.impl.service;

import college.impl.entity.Faculty;
import college.impl.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    public Faculty create(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    public Faculty getById(String id) {
        return facultyRepository.findAllById(id);
    }

    public Faculty update(Faculty faculty) {
        return facultyRepository.saveAndFlush(faculty);
    }

    public void delete(Faculty faculty) {
        facultyRepository.delete(faculty);
    }
}