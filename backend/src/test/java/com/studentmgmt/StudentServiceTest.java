package com.studentmgmt;

import com.studentmgmt.dto.StudentDTO;
import com.studentmgmt.entity.Student;
import com.studentmgmt.exception.DuplicateEmailException;
import com.studentmgmt.exception.StudentNotFoundException;
import com.studentmgmt.repository.StudentRepository;
import com.studentmgmt.service.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student;
    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        student = new Student(1L, "Test User", "test@example.com", "9876543210", "CS", 3, 8.5);
        studentDTO = new StudentDTO(null, "Test User", "test@example.com", "9876543210", "CS", 3, 8.5);
    }

    @Test
    void createStudent_Success() {
        when(studentRepository.existsByEmail(anyString())).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.createStudent(studentDTO);

        assertNotNull(result);
        assertEquals("Test User", result.getName());
        assertEquals("test@example.com", result.getEmail());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void createStudent_DuplicateEmail_ThrowsException() {
        when(studentRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> studentService.createStudent(studentDTO));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void getStudentById_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        StudentDTO result = studentService.getStudentById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getStudentById_NotFound_ThrowsException() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(StudentNotFoundException.class, () -> studentService.getStudentById(99L));
    }

    @Test
    void getAllStudents_ReturnsAllStudents() {
        when(studentRepository.findAll()).thenReturn(List.of(student));

        List<StudentDTO> result = studentService.getAllStudents();

        assertEquals(1, result.size());
    }

    @Test
    void updateStudent_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(studentRepository.existsByEmailAndIdNot(anyString(), anyLong())).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentDTO result = studentService.updateStudent(1L, studentDTO);

        assertNotNull(result);
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void updateStudent_NotFound_ThrowsException() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(StudentNotFoundException.class, () -> studentService.updateStudent(99L, studentDTO));
    }

    @Test
    void deleteStudent_Success() {
        when(studentRepository.existsById(1L)).thenReturn(true);

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteStudent_NotFound_ThrowsException() {
        when(studentRepository.existsById(99L)).thenReturn(false);

        assertThrows(StudentNotFoundException.class, () -> studentService.deleteStudent(99L));
    }
}
