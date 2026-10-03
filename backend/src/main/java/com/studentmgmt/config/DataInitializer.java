package com.studentmgmt.config;

import com.studentmgmt.entity.Student;
import com.studentmgmt.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("!test")
    public CommandLineRunner loadSampleData(StudentRepository studentRepository) {
        return args -> {
            if (studentRepository.count() == 0) {
                List<Student> sampleStudents = List.of(
                    new Student(null, "Aarav Sharma", "aarav.sharma@college.edu", "9876543210", "Computer Science", 3, 8.7),
                    new Student(null, "Priya Nair", "priya.nair@college.edu", "9123456789", "Electronics", 2, 9.1),
                    new Student(null, "Rohit Menon", "rohit.menon@college.edu", "9000112233", "Mechanical", 4, 7.5),
                    new Student(null, "Sneha Patel", "sneha.patel@college.edu", "9812345678", "Computer Science", 1, 9.4),
                    new Student(null, "Arjun Reddy", "arjun.reddy@college.edu", "9988776655", "Civil", 3, 6.8),
                    new Student(null, "Meera Iyer", "meera.iyer@college.edu", "9700001234", "Electronics", 4, 8.2),
                    new Student(null, "Vikram Singh", "vikram.singh@college.edu", "9600009876", "Computer Science", 2, 7.9),
                    new Student(null, "Kavya Krishnan", "kavya.krishnan@college.edu", "9400005678", "Information Technology", 1, 9.0),
                    new Student(null, "Aditya Kumar", "aditya.kumar@college.edu", "9300004321", "Mechanical", 5, 7.2),
                    new Student(null, "Divya Pillai", "divya.pillai@college.edu", "9200008765", "Civil", 2, 8.5)
                );
                studentRepository.saveAll(sampleStudents);
                System.out.println("✅ Sample data loaded: " + sampleStudents.size() + " students");
            }
        };
    }
}
