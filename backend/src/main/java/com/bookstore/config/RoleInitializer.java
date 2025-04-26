package com.bookstore.config;

import com.bookstore.model.ERole;
import com.bookstore.model.Role;
import com.bookstore.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * This class initializes the roles in the database when the application starts.
 * It implements CommandLineRunner to run the initialization code after the Spring context is initialized.
 */
@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if roles already exist
        if (roleRepository.count() == 0) {
            // Create roles
            List<Role> roles = Arrays.asList(
                new Role(ERole.ROLE_USER),
                new Role(ERole.ROLE_ADMIN)
            );
            
            // Save roles to database
            roleRepository.saveAll(roles);
            
            System.out.println("Roles initialized successfully!");
        } else {
            System.out.println("Roles already exist in the database.");
        }
    }
}
