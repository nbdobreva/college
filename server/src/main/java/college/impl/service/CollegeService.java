package college.impl.service;

import college.impl.dto.CollegeDTO;
import college.impl.entity.College;
import college.impl.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollegeService {

    @Autowired
    private CollegeRepository collegeRepository;

    public College create(College college) {
        return collegeRepository.save(college);
    }

    public List<College> getAll() {
        return collegeRepository.findAll();
    }

    public College getById(String id) {
        return collegeRepository.findAllById(id);
    }

    public College update(College college) {
        return collegeRepository.saveAndFlush(college);
    }

    public void delete(College college) {
        collegeRepository.delete(college);
    }
}