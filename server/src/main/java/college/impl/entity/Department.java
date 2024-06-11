package college.impl.entity;

import org.springframework.boot.autoconfigure.domain.EntityScan;

import jakarta.persistence.*;
import java.util.List;

@Entity
@EntityScan
@Table(name = "DEPARTMENTS")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="ID")
    private String id;

    @Column(name = "NAME")
    private String name;

    @OneToOne
    @JoinColumn(name = "HEAD_ID")
    private Teacher head;

    @ManyToOne
    @JoinColumn(name = "FACULTY_ID")
    private Faculty faculty;

    @OneToMany(mappedBy = "department")
    private List<Teacher> teachers;

    @OneToMany(mappedBy = "department")
    private List<Course> courses;

    public Department() {
    }

    public Department(String name, Teacher head, Faculty faculty) {
        this.name = name;
        this.head = head;
        this.faculty = faculty;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Teacher getHead() {
        return head;
    }

    public void setHead(Teacher head) {
        this.head = head;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }

    public List<Teacher> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<Teacher> teachers) {
        this.teachers = teachers;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }
}
