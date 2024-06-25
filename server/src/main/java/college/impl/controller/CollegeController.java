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
@RequestMapping("/api/College")
@Validated
public class CollegeController {

    @Autowired
    CollegeService collegeService;

    @PutMapping(value = "/{collegeId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<College> updateCollege(@PathVariable String collegeId, @RequestBody CollegeDTO collegeDTO) {
        College existingCollege = findExistingCollege(collegeId);

        College updatedCollege = collegeService.update(collegeUpdate(existingCollege, collegeDTO));
        return ResponseEntity.ok(updatedCollege);
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
