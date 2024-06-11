package college.impl.controller;

import college.impl.dto.DepartmentDTO;
import college.impl.dto.FacultyDTO;
import college.impl.entity.College;
import college.impl.entity.Department;
import college.impl.entity.Faculty;
import college.impl.entity.Teacher;
import college.impl.service.CollegeService;
import college.impl.service.DepartmentService;
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
@RequestMapping("/api/Departments")
@Validated
public class DepartmentController {

    @Autowired
    DepartmentService departmentService;

    @Autowired
    FacultyService facultyService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody DepartmentDTO departmentDTO) {
        Department createResult = departmentService.create(newDepartment(departmentDTO));

        return new ResponseEntity<>(createResult, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.getAll();

        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    @GetMapping(value = "/{departmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> getDepartmentById(@PathVariable String departmentId) {
        Department department = departmentService.getById(departmentId);

        return new ResponseEntity<>(department, HttpStatus.OK);
    }

    @PutMapping(value = "/{departmentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> updateDepartment(@PathVariable String departmentId, @Valid @RequestBody DepartmentDTO departmentDTO) {
        Department updatedDepartment = updatedDepartment(departmentId, departmentDTO);

        Department updateResult = departmentService.update(updatedDepartment);
        return new ResponseEntity<>(updateResult, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(value = "/{departmentId}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String departmentId) {
        Department department = findExistingDepartment(departmentId);

        departmentService.delete(department);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Department findExistingDepartment(String id) {
        Department department = departmentService.getById(id);

        if (Objects.isNull(department)) {
            throw new EntityNotFoundException("Faculty with the provided id not found.");
        }

        return department;
    }

    private Faculty findExistingFaculty(String id) {
        Faculty existingFaculty = facultyService.getById(id);

        if (Objects.isNull(existingFaculty)) {
            throw new EntityNotFoundException("Faculty with the provided id not found.");
        }

        return existingFaculty;
    }

    private Department newDepartment(DepartmentDTO departmentDTO) {
        Department department = new Department();

        department.setName(departmentDTO.getName());

        Faculty faculty = findExistingFaculty(departmentDTO.getFacultyId());
        department.setFaculty(faculty);

        Teacher headTeacher = null; //#TODO Add teacher
        department.setHead(headTeacher);

        return department;
    }

    private Department updatedDepartment(String id, DepartmentDTO departmentDTO) {
        Department department = findExistingDepartment(id);

        department.setName(departmentDTO.getName());

        Faculty faculty = null;
        if (Objects.nonNull(departmentDTO.getFacultyId())) {
            faculty = findExistingFaculty(departmentDTO.getFacultyId());
        }

        department.setFaculty(faculty);

        Teacher headTeacher = null;
        if (Objects.nonNull(departmentDTO.getHeadId())) {
            //#TODO Find teacher
        }

        department.setHead(headTeacher);

        return department;
    }
}
