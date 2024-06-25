package college.impl.controller;

import college.impl.dto.DepartmentDTO;
import college.impl.dto.FacultyDTO;
import college.impl.dto.response.DepartmentResponseDTO;
import college.impl.entity.Department;
import college.impl.entity.Faculty;
import college.impl.entity.Teacher;
import college.impl.service.DepartmentService;
import college.impl.service.FacultyService;
import college.impl.service.TeacherService;
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

    @Autowired
    TeacherService teacherService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody DepartmentDTO departmentDTO) {
        Department createdDepartment = departmentService.create(entityFromDTO(new Department(), departmentDTO));

        return new ResponseEntity<>(createdDepartment, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.getAll();

        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    @GetMapping(value = "/{departmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DepartmentResponseDTO> getDepartmentById(@PathVariable String departmentId) {
        Department department = departmentService.getById(departmentId);

        return new ResponseEntity<>(new DepartmentResponseDTO(department), HttpStatus.OK);
    }

    @GetMapping(params = "facultyId")
    public ResponseEntity<List<Department>> getDepartmentsByFacultyId(@RequestParam String facultyId) {
        Faculty faculty = findExistingFaculty(facultyId);
        List<Department> departments = departmentService.getByFaculty(faculty);

        return new ResponseEntity<>(departments, HttpStatus.OK);
    }

    @PutMapping(value = "/{departmentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> updateDepartment(@PathVariable String departmentId, @Valid @RequestBody DepartmentDTO departmentDTO) {
        Department existingDepartment = findExistingDepartment(departmentId);

        Department updatedDepartment = departmentService.update(entityFromDTO(existingDepartment, departmentDTO));
        return new ResponseEntity<>(updatedDepartment, HttpStatus.OK);
    }

    @PatchMapping (value = "/{departmentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Department> patchUpdateDepartment(@PathVariable String departmentId, @Valid @RequestBody DepartmentDTO departmentDTO) {
        Department existingDepartment = findExistingDepartment(departmentId);

        Department updatedDepartment = departmentService.update(modifiedDepartment(existingDepartment, departmentDTO));
        return new ResponseEntity<>(updatedDepartment, HttpStatus.OK);
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
            throw new EntityNotFoundException("Department with the provided id not found.");
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

    private Department entityFromDTO(Department department, DepartmentDTO dto) {
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());

        Faculty faculty = findExistingFaculty(dto.getFacultyId());
        department.setFaculty(faculty);

        Teacher headTeacher = null;
        if (Objects.nonNull(dto.getHeadId())) {
           headTeacher = teacherService.getById(dto.getHeadId());
        }

        department.setHead(headTeacher);

        return department;
    }

    private Department modifiedDepartment(Department department, DepartmentDTO dto) {
        if (Objects.nonNull(dto.getName())) {
            department.setName(dto.getName());
        }

        if (Objects.nonNull(dto.getDescription())) {
            department.setDescription(dto.getDescription());
        }

        if (Objects.nonNull(dto.getHeadId())) {
            Teacher headTeacher = teacherService.getById(dto.getHeadId());
            department.setHead(headTeacher);
        }

        return department;
    }

}
