package college.impl.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import jakarta.persistence.*;
import java.util.List;

@Entity
@EntityScan
@Table(name = "TEACHERS")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="ID")
    private String id;

    @OneToOne(mappedBy = "head")
    @JsonBackReference
    private Department headOf;

    @ManyToOne
    @JoinColumn(name = "DEPARTMENT_ID")
    @JsonManagedReference
    private Department department;

    @OneToOne
    @JoinColumn(name = "USER_ID")
    @JsonManagedReference
    private User user;

    @OneToMany(mappedBy = "teacher")
    @JsonBackReference
    private List<Course> courses;

    public Teacher() {
    }

    public Teacher(Department headOf, Department department, User user) {
        this.headOf = headOf;
        this.department = department;
        this.user = user;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Department getHeadOf() {
        return headOf;
    }

    public void setHeadOf(Department headOf) {
        this.headOf = headOf;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }
}
