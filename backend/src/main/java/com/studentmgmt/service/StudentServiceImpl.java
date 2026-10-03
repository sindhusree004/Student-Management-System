package com.studentmgmt.service;

import com.studentmgmt.dto.StudentDTO;
import com.studentmgmt.entity.Student;
import com.studentmgmt.exception.DuplicateEmailException;
import com.studentmgmt.exception.StudentNotFoundException;
import com.studentmgmt.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new DuplicateEmailException(studentDTO.getEmail());
        }
        Student student = mapToEntity(studentDTO);
        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        return mapToDTO(student);
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        // Check email uniqueness excluding this student
        if (studentRepository.existsByEmailAndIdNot(studentDTO.getEmail(), id)) {
            throw new DuplicateEmailException(studentDTO.getEmail());
        }

        existing.setName(studentDTO.getName());
        existing.setEmail(studentDTO.getEmail());
        existing.setPhone(studentDTO.getPhone());
        existing.setDepartment(studentDTO.getDepartment());
        existing.setYear(studentDTO.getYear());
        existing.setCgpa(studentDTO.getCgpa());

        Student updated = studentRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> searchStudents(String search, String department, Integer year) {
        String searchParam = (search != null && search.isBlank()) ? null : search;
        String deptParam = (department != null && department.isBlank()) ? null : department;
        return studentRepository.searchStudents(searchParam, deptParam, year)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getStudentCount() {
        return studentRepository.count();
    }

    // --- Mapper Methods ---

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setDepartment(student.getDepartment());
        dto.setYear(student.getYear());
        dto.setCgpa(student.getCgpa());
        return dto;
    }

    private Student mapToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDepartment(dto.getDepartment());
        student.setYear(dto.getYear());
        student.setCgpa(dto.getCgpa());
        return student;
    }
}
