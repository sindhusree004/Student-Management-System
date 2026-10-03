package com.studentmgmt.controller;

import com.studentmgmt.dto.ApiResponse;
import com.studentmgmt.dto.StudentDTO;
import com.studentmgmt.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // POST /api/students - Create a new student
    @PostMapping
    public ResponseEntity<ApiResponse<StudentDTO>> createStudent(
            @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO created = studentService.createStudent(studentDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", created));
    }

    // GET /api/students - Get all students (with optional search/filter)
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year) {

        List<StudentDTO> students;
        if (search != null || department != null || year != null) {
            students = studentService.searchStudents(search, department, year);
        } else {
            students = studentService.getAllStudents();
        }
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    // GET /api/students/count - Get total count
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getCount() {
        long count = studentService.getStudentCount();
        return ResponseEntity.ok(ApiResponse.success("Count retrieved", Map.of("count", count)));
    }

    // GET /api/students/{id} - Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentById(@PathVariable Long id) {
        StudentDTO student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student));
    }

    // PUT /api/students/{id} - Update student
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDTO>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO studentDTO) {
        StudentDTO updated = studentService.updateStudent(id, studentDTO);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    // DELETE /api/students/{id} - Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
}
