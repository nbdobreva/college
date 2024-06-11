package college.impl.entity;

import college.impl.dto.CollegeDTO;
import jakarta.persistence.*;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import java.util.List;

@Entity
@EntityScan
@Table(name = "COLLEGES")
public class College {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "ADDRESS")
    private String address;

    @OneToMany(mappedBy = "college")
    private List<Faculty> faculties;

    public College() {
    }

    public College(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public College(CollegeDTO collegeDTO) {
        this.name = collegeDTO.getName();
        this.address = collegeDTO.getAddress();
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public String getAddress() {
        return this.address;
    }
}
