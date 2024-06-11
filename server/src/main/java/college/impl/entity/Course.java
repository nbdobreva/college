package college.impl.entity;

import org.springframework.boot.autoconfigure.domain.EntityScan;

import jakarta.persistence.*;
import java.util.List;

@Entity
@EntityScan
@Table(name="COURSES")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="ID")
    private String id;

    @Column(name="NAME")
    private String name;

    @ManyToOne
    @JoinColumn(name = "TEACHER_ID")
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "DEPARTMENT_ID")
    private Department department;

    @ManyToMany(mappedBy="courses")
    private List<Student> students;
}
