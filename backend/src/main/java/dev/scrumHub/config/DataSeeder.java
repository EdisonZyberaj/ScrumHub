package dev.scrumHub.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Check if sprints table is empty
        Integer sprintCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM sprints", Integer.class);
        
        if (sprintCount != null && sprintCount == 0) {
            System.out.println("Seeding database with sample sprint data...");
            
            // Read and execute SQL script
            ClassPathResource resource = new ClassPathResource("sample-sprints.sql");
            String sql = new String(Files.readAllBytes(Paths.get(resource.getURI())), StandardCharsets.UTF_8);
            
            // Split by semicolon and execute each statement
            String[] statements = sql.split(";");
            for (String statement : statements) {
                statement = statement.trim();
                if (!statement.isEmpty() && !statement.startsWith("--")) {
                    jdbcTemplate.execute(statement);
                }
            }
            
            System.out.println("Sample sprint data seeded successfully!");
        } else {
            System.out.println("Sprints table already contains data, skipping seeding.");
        }
    }
}