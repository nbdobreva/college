package college.impl.controller;

import college.impl.dto.CollegeDTO;
import college.impl.dto.FacultyDTO;
import college.impl.entity.College;
import college.impl.entity.Faculty;
import college.impl.service.CollegeService;
import college.impl.service.FacultyService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
@RequestMapping("/api/Faculties")
@Validated
public class FacultyController {

    @Autowired
    FacultyService facultyService;

    @Autowired
    CollegeService collegeService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Faculty> createFaculty(@Valid @RequestBody FacultyDTO facultyDTO) {
        College college = findExistingCollege(facultyDTO.getCollegeId());
        Faculty createdFaculty = facultyService.create(new Faculty(facultyDTO.getName(), college));

        return new ResponseEntity<>(createdFaculty, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculties() {
        List<Faculty> faculties = facultyService.getAll();

        return new ResponseEntity<>(faculties, HttpStatus.OK);
    }

    @GetMapping(value = "/{facultyId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Faculty> getFacultyById(@PathVariable String facultyId) {
        Faculty faculty = facultyService.getById(facultyId);

        return new ResponseEntity<>(faculty, HttpStatus.OK);
    }

    @PutMapping(value = "/{facultyId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Faculty> updateFaculty(@PathVariable String facultyId, @Valid @RequestBody FacultyDTO facultyDTO) {
        Faculty existingFaculty = findExistingFaculty(facultyId);

        Faculty updatedFaculty = facultyService.update(facultyUpdate(existingFaculty, facultyDTO));
        return new ResponseEntity<>(updatedFaculty, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/{facultyId}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable String facultyId) {
        Faculty faculty = findExistingFaculty(facultyId);
        facultyService.delete(faculty);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Faculty findExistingFaculty(String id) {
        Faculty existingFaculty = facultyService.getById(id);

        if (Objects.isNull(existingFaculty)) {
            throw new EntityNotFoundException("Faculty with the provided id not found.");
        }

        return existingFaculty;
    }

    private College findExistingCollege(String id) {
        College existingCollege = collegeService.getById(id);

        if (Objects.isNull(existingCollege)) {
            throw new EntityNotFoundException("College with the provided id not found.");
        }

        return existingCollege;
    }

    private Faculty facultyUpdate(Faculty existingFaculty, FacultyDTO updateBody) {
        College college = findExistingCollege(updateBody.getCollegeId());

        existingFaculty.setCollege(college);
        existingFaculty.setName(updateBody.getName());

        return existingFaculty;
    }
}
