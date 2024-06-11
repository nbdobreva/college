package college.impl.controller;

import college.impl.dto.CollegeDTO;
import college.impl.entity.College;
import college.impl.service.CollegeService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/Colleges")
@Validated
public class CollegeController {

    @Autowired
    CollegeService collegeService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<College> createCollege(@Valid @RequestBody CollegeDTO collegeDTO) {
        College college = collegeService.create(new College(collegeDTO));
        return new ResponseEntity<>(college, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        List<College> colleges = collegeService.getAll();
        return ResponseEntity.ok(colleges);
    }

    @GetMapping(value = "/{collegeId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<College> getCollegeById(@PathVariable String collegeId) {
        College college = collegeService.getById(collegeId);
        return ResponseEntity.ok(college);
    }

    @PutMapping(value = "/{collegeId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<College> updateCollege(@PathVariable String collegeId, @RequestBody CollegeDTO collegeDTO) {
        College existingCollege = findExistingCollege(collegeId);

        College updatedCollege = collegeService.update(collegeUpdate(existingCollege, collegeDTO));
        return ResponseEntity.ok(updatedCollege);
    }

    @DeleteMapping(value = "/{collegeId}")
    public ResponseEntity<Void> deleteCollege(@PathVariable String collegeId) {
        College college = findExistingCollege(collegeId);
        collegeService.delete(college);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private College findExistingCollege(String id) {
        College existingCollege = collegeService.getById(id);

        if (Objects.isNull(existingCollege)) {
            throw new EntityNotFoundException();
        }

        return existingCollege;
    }

    private College collegeUpdate(College existingCollege, CollegeDTO updateBody) {
        existingCollege.setName(updateBody.getName());
        existingCollege.setAddress(updateBody.getAddress());

        return existingCollege;
    }
}
