package college.impl.entity;

import org.springframework.boot.autoconfigure.domain.EntityScan;

import jakarta.persistence.*;
import java.util.List;

@Entity
@EntityScan
@Table(name = "STUDENTS")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="ID")
    protected String id;

    @OneToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "STUDENT_COURSE",
            joinColumns = @JoinColumn(name = "STUDENT_ID"),
            inverseJoinColumns = @JoinColumn(name = "COURSE_ID"))
    private List<Course> courses;
}
