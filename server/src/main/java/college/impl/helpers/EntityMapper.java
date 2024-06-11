package college.impl.helpers;

import college.impl.dto.DepartmentDTO;
import college.impl.entity.Department;

public class EntityMapper {
    public static Department department(DepartmentDTO departmentDTO) {
        Department mappedDepartment = new Department();
        mappedDepartment.setName(departmentDTO.getName());
        return mappedDepartment;
    }
}
