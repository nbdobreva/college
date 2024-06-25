package college.impl.controller;

import college.impl.dto.FacultyDTO;
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
        verifyNameIsPresent(facultyDTO);
        Faculty createdFaculty = facultyService.create(entityFromDTO(new Faculty(), facultyDTO));

        return new ResponseEntity<>(createdFaculty, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculties() {
        List<Faculty> faculties = facultyService.getAll();

        return new ResponseEntity<>(faculties, HttpStatus.OK);
    }

    @GetMapping(value = "/{facultyId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Faculty> getFacultyById(@PathVariable String facultyId) {
        Faculty faculty = existingFaculty(facultyId);

        return new ResponseEntity<>(faculty, HttpStatus.OK);
    }

    @PutMapping(value = "/{facultyId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Faculty> updateFaculty(@PathVariable String facultyId, @Valid @RequestBody FacultyDTO facultyDTO) {
        verifyNameIsPresent(facultyDTO);
        Faculty existingFactuly = existingFaculty(facultyId);

        Faculty updatedFaculty = facultyService.update(entityFromDTO(existingFactuly, facultyDTO));
        return new ResponseEntity<>(updatedFaculty, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/{facultyId}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable String facultyId) {
        Faculty existingFaculty = existingFaculty(facultyId);
        facultyService.delete(existingFaculty);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Faculty existingFaculty(String id) {
        Faculty existingFaculty = facultyService.getById(id);

        if (Objects.isNull(existingFaculty)) {
            throw new EntityNotFoundException("Faculty with the provided id not found.");
        }

        return existingFaculty;
    }

    private Faculty entityFromDTO(Faculty faculty, FacultyDTO dto) {
        faculty.setName(dto.getName());
        faculty.setDescription(dto.getDescription());

        return faculty;
    }

    private void verifyNameIsPresent(FacultyDTO dto) {
        if (dto.getName().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty.");
        }
    }
}
