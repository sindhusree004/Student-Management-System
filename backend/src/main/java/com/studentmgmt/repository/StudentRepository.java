package com.studentmgmt.repository;

import com.studentmgmt.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<Student> findByEmail(String email);

    @Query("SELECT s FROM Student s WHERE " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:department IS NULL OR s.department = :department) " +
           "AND (:year IS NULL OR s.year = :year)")
    List<Student> searchStudents(
            @Param("search") String search,
            @Param("department") String department,
            @Param("year") Integer year
    );

    List<Student> findByDepartment(String department);

    List<Student> findByYear(Integer year);
}
