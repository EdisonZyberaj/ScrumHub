package dev.scrumHub.config;

import dev.scrumHub.model.*;
import dev.scrumHub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final TaskRepository taskRepository;
    private final UserProjectRepository userProjectRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            loadTestData();
        } else {
            // Activate existing users and add sample tasks if tasks don't exist
            activateUsersAndAddTasks();
        }
    }

    private void loadTestData() {
        // Create Users
        User scrumMaster = User.builder()
                .username("sarah.smith")
                .email("sarah.smith@scrumhub.com")
                .fullName("Sarah Smith")
                .password(passwordEncoder.encode("password123"))
                .role(User.UserRole.SCRUM_MASTER)
                .active(true)
                .build();

        User developer1 = User.builder()
                .username("john.doe")
                .email("john.doe@scrumhub.com")
                .fullName("John Doe")
                .password(passwordEncoder.encode("password123"))
                .role(User.UserRole.DEVELOPER)
                .active(true)
                .build();

        User developer2 = User.builder()
                .username("jane.wilson")
                .email("jane.wilson@scrumhub.com")
                .fullName("Jane Wilson")
                .password(passwordEncoder.encode("password123"))
                .role(User.UserRole.DEVELOPER)
                .active(true)
                .build();

        User tester1 = User.builder()
                .username("mike.johnson")
                .email("mike.johnson@scrumhub.com")
                .fullName("Mike Johnson")
                .password(passwordEncoder.encode("password123"))
                .role(User.UserRole.TESTER)
                .active(true)
                .build();

        User tester2 = User.builder()
                .username("lisa.brown")
                .email("lisa.brown@scrumhub.com")
                .fullName("Lisa Brown")
                .password(passwordEncoder.encode("password123"))
                .role(User.UserRole.TESTER)
                .active(true)
                .build();

        List<User> users = Arrays.asList(scrumMaster, developer1, developer2, tester1, tester2);
        userRepository.saveAll(users);

        // Create Projects
        Project ecommerceProject = Project.builder()
                .name("E-commerce Platform")
                .description("Modern e-commerce platform with React frontend and Spring Boot backend")
                .key("ECOM")
                .startDate(LocalDateTime.now().minusDays(30))
                .endDate(LocalDateTime.now().plusDays(60))
                .active(true)
                .build();

        Project mobileAppProject = Project.builder()
                .name("Mobile Banking App")
                .description("Secure mobile banking application with biometric authentication")
                .key("BANK")
                .startDate(LocalDateTime.now().minusDays(15))
                .endDate(LocalDateTime.now().plusDays(75))
                .active(true)
                .build();

        List<Project> projects = Arrays.asList(ecommerceProject, mobileAppProject);
        projectRepository.saveAll(projects);

        // Add users to projects
        addUserToProject(scrumMaster, ecommerceProject, UserProject.ProjectRole.SCRUM_MASTER);
        addUserToProject(developer1, ecommerceProject, UserProject.ProjectRole.DEVELOPER);
        addUserToProject(developer2, ecommerceProject, UserProject.ProjectRole.DEVELOPER);
        addUserToProject(tester1, ecommerceProject, UserProject.ProjectRole.TESTER);

        addUserToProject(scrumMaster, mobileAppProject, UserProject.ProjectRole.SCRUM_MASTER);
        addUserToProject(developer2, mobileAppProject, UserProject.ProjectRole.DEVELOPER);
        addUserToProject(tester2, mobileAppProject, UserProject.ProjectRole.TESTER);

        // Create Sprints
        Sprint sprint1 = Sprint.builder()
                .name("Sprint 1 - User Authentication")
                .goal("Implement user registration, login, and basic profile management")
                .project(ecommerceProject)
                .startDate(LocalDateTime.now().minusDays(14))
                .endDate(LocalDateTime.now())
                .status(Sprint.SprintStatus.COMPLETED)
                .build();

        Sprint sprint2 = Sprint.builder()
                .name("Sprint 2 - Product Catalog")
                .goal("Build product browsing, search, and filtering functionality")
                .project(ecommerceProject)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(14))
                .status(Sprint.SprintStatus.ACTIVE)
                .build();

        Sprint sprint3 = Sprint.builder()
                .name("Sprint 1 - Core Banking Features")
                .goal("Implement account balance, transaction history, and basic transfers")
                .project(mobileAppProject)
                .startDate(LocalDateTime.now().minusDays(7))
                .endDate(LocalDateTime.now().plusDays(7))
                .status(Sprint.SprintStatus.ACTIVE)
                .build();

        List<Sprint> sprints = Arrays.asList(sprint1, sprint2, sprint3);
        sprintRepository.saveAll(sprints);

        // Create Tasks for E-commerce Project
        createTask("User Registration API", "Implement REST API endpoints for user registration with validation", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.DONE, 
                ecommerceProject, sprint1, developer1, developer1, 8, 8);

        createTask("Login Authentication", "Implement JWT-based authentication system", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.DONE, 
                ecommerceProject, sprint1, developer1, developer1, 6, 6);

        createTask("User Profile Management", "Create user profile CRUD operations", 
                Task.TaskType.USER_STORY, Task.TaskPriority.MEDIUM, Task.TaskStatus.DONE, 
                ecommerceProject, sprint1, developer2, developer2, 4, 4);

        createTask("Product Search API", "Implement search functionality with filters", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.IN_PROGRESS, 
                ecommerceProject, sprint2, developer1, developer1, 12, 6);

        createTask("Product Catalog Frontend", "Build React components for product browsing", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.TO_DO, 
                ecommerceProject, sprint2, developer2, developer2, 10, 0);

        createTask("Shopping Cart Implementation", "Add to cart and cart management functionality", 
                Task.TaskType.USER_STORY, Task.TaskPriority.MEDIUM, Task.TaskStatus.TO_DO, 
                ecommerceProject, sprint2, null, developer1, 8, 0);

        createTask("Fix product image loading", "Product images not displaying correctly on mobile", 
                Task.TaskType.BUG, Task.TaskPriority.HIGH, Task.TaskStatus.READY_FOR_TESTING, 
                ecommerceProject, sprint2, developer1, developer1, 2, 2);

        createTask("Improve search performance", "Search queries taking too long", 
                Task.TaskType.BUG, Task.TaskPriority.MEDIUM, Task.TaskStatus.IN_TESTING, 
                ecommerceProject, sprint2, developer2, developer2, 4, 3);

        // Create Tasks for Banking Project
        createTask("Account Balance API", "Implement secure account balance retrieval", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.IN_PROGRESS, 
                mobileAppProject, sprint3, developer2, developer2, 6, 3);

        createTask("Transaction History", "Display user transaction history with pagination", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.TO_DO, 
                mobileAppProject, sprint3, null, developer2, 8, 0);

        createTask("Biometric Authentication", "Implement fingerprint and face recognition", 
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.TO_DO, 
                mobileAppProject, sprint3, null, developer2, 16, 0);

        createTask("Security vulnerability assessment", "Review and fix potential security issues", 
                Task.TaskType.TASK, Task.TaskPriority.CRITICAL, Task.TaskStatus.TO_DO, 
                mobileAppProject, sprint3, null, tester2, 12, 0);

        System.out.println("✅ Test data loaded successfully!");
        System.out.println("📊 Created:");
        System.out.println("   - 5 users (1 scrum master, 2 developers, 2 testers)");
        System.out.println("   - 2 projects (E-commerce, Banking)");
        System.out.println("   - 3 sprints (1 completed, 2 active)");
        System.out.println("   - 12 tasks with various statuses");
        System.out.println("\n🔐 Login credentials (all users): password123");
        System.out.println("   - Scrum Master: sarah.smith");
        System.out.println("   - Developers: john.doe, jane.wilson");
        System.out.println("   - Testers: mike.johnson, lisa.brown");
    }

    private void addUserToProject(User user, Project project, UserProject.ProjectRole role) {
        UserProject userProject = UserProject.builder()
                .id(new UserProjectId(user.getId(), project.getId()))
                .user(user)
                .project(project)
                .roleInProject(role)
                .build();
        userProjectRepository.save(userProject);
    }

    private void createTask(String title, String description, Task.TaskType type, 
                           Task.TaskPriority priority, Task.TaskStatus status, 
                           Project project, Sprint sprint, User assignee, User creator, 
                           int estimatedHours, int loggedHours) {
        Task task = Task.builder()
                .title(title)
                .description(description)
                .type(type)
                .priority(priority)
                .status(status)
                .project(project)
                .sprint(sprint)
                .assignee(assignee)
                .createdBy(creator)
                .estimatedHours(estimatedHours)
                .loggedHours(loggedHours)
                .dueDate(LocalDateTime.now().plusDays(7))
                .acceptanceCriteria("- Task should be completed according to requirements\n- Code should be reviewed\n- Tests should pass")
                .build();
        taskRepository.save(task);
    }

    private void activateUsersAndAddTasks() {
        // Check if tasks already exist
        if (taskRepository.count() > 0) {
            System.out.println("Tasks already exist, skipping data loading...");
            return;
        }

        // Activate all users
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (!user.isActive()) {
                user.setActive(true);
                userRepository.save(user);
            }
        }

        // Get existing projects
        List<Project> projects = projectRepository.findAll();
        if (projects.isEmpty()) {
            System.out.println("No projects found, cannot create tasks.");
            return;
        }

        // Get users by role
        List<User> scrumMasters = userRepository.findByRole(User.UserRole.SCRUM_MASTER);
        List<User> developers = userRepository.findByRole(User.UserRole.DEVELOPER);
        List<User> testers = userRepository.findByRole(User.UserRole.TESTER);

        if (scrumMasters.isEmpty() || developers.isEmpty()) {
            System.out.println("Not enough users with required roles to create tasks.");
            return;
        }

        User scrumMaster = scrumMasters.get(0);
        User developer1 = developers.size() > 0 ? developers.get(0) : scrumMaster;
        User developer2 = developers.size() > 1 ? developers.get(1) : developer1;
        User tester = testers.size() > 0 ? testers.get(0) : scrumMaster;

        // Create sprints for first two projects
        Project project1 = projects.get(0);
        Project project2 = projects.size() > 1 ? projects.get(1) : project1;

        Sprint sprint1 = Sprint.builder()
                .name("Sprint 1 - Initial Development")
                .goal("Set up foundation and basic features")
                .project(project1)
                .startDate(LocalDateTime.now().minusDays(14))
                .endDate(LocalDateTime.now())
                .status(Sprint.SprintStatus.COMPLETED)
                .build();

        Sprint sprint2 = Sprint.builder()
                .name("Sprint 2 - Core Features")
                .goal("Implement main functionalities")
                .project(project1)
                .startDate(LocalDateTime.now())
                .endDate(LocalDateTime.now().plusDays(14))
                .status(Sprint.SprintStatus.ACTIVE)
                .build();

        Sprint sprint3 = Sprint.builder()
                .name("Sprint 1 - Project Setup")
                .goal("Initial project setup and planning")
                .project(project2)
                .startDate(LocalDateTime.now().minusDays(7))
                .endDate(LocalDateTime.now().plusDays(7))
                .status(Sprint.SprintStatus.ACTIVE)
                .build();

        List<Sprint> sprints = Arrays.asList(sprint1, sprint2, sprint3);
        sprintRepository.saveAll(sprints);

        // Create sample tasks
        createTask("User Authentication Setup", "Implement user login and registration system",
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.DONE,
                project1, sprint1, developer1, scrumMaster, 8, 8);

        createTask("Database Schema Design", "Design and implement database tables",
                Task.TaskType.TASK, Task.TaskPriority.HIGH, Task.TaskStatus.DONE,
                project1, sprint1, developer1, scrumMaster, 6, 6);

        createTask("API Endpoint Development", "Create REST API endpoints for core functionality",
                Task.TaskType.USER_STORY, Task.TaskPriority.HIGH, Task.TaskStatus.IN_PROGRESS,
                project1, sprint2, developer2, scrumMaster, 12, 4);

        createTask("Frontend UI Components", "Develop React components for user interface",
                Task.TaskType.USER_STORY, Task.TaskPriority.MEDIUM, Task.TaskStatus.TO_DO,
                project1, sprint2, developer1, scrumMaster, 10, 0);

        createTask("Testing Framework Setup", "Set up automated testing framework",
                Task.TaskType.TASK, Task.TaskPriority.MEDIUM, Task.TaskStatus.TO_DO,
                project1, sprint2, null, scrumMaster, 6, 0);

        createTask("Performance Optimization", "Optimize application performance",
                Task.TaskType.TASK, Task.TaskPriority.LOW, Task.TaskStatus.READY_FOR_TESTING,
                project1, sprint2, developer2, scrumMaster, 4, 4);

        createTask("Bug Fix - Login Issues", "Fix login authentication problems",
                Task.TaskType.BUG, Task.TaskPriority.HIGH, Task.TaskStatus.IN_TESTING,
                project1, sprint2, developer1, scrumMaster, 3, 2);

        createTask("Security Assessment", "Conduct security review and testing",
                Task.TaskType.TASK, Task.TaskPriority.HIGH, Task.TaskStatus.TEST_PASSED,
                project1, sprint2, tester, scrumMaster, 8, 8);

        // Tasks for second project
        createTask("Project Architecture Planning", "Plan overall system architecture",
                Task.TaskType.TASK, Task.TaskPriority.HIGH, Task.TaskStatus.IN_PROGRESS,
                project2, sprint3, developer2, scrumMaster, 6, 3);

        createTask("Initial Setup and Configuration", "Set up development environment",
                Task.TaskType.TASK, Task.TaskPriority.HIGH, Task.TaskStatus.TO_DO,
                project2, sprint3, developer1, scrumMaster, 4, 0);

        createTask("Requirements Analysis", "Analyze and document requirements",
                Task.TaskType.TASK, Task.TaskPriority.MEDIUM, Task.TaskStatus.TO_DO,
                project2, sprint3, null, scrumMaster, 8, 0);

        createTask("Quality Assurance Planning", "Plan QA process and testing strategy",
                Task.TaskType.TASK, Task.TaskPriority.MEDIUM, Task.TaskStatus.BUG_FOUND,
                project2, sprint3, tester, scrumMaster, 5, 3);

        System.out.println("✅ Sample data added successfully!");
        System.out.println("📊 Created:");
        System.out.println("   - Activated " + users.size() + " existing users");
        System.out.println("   - 3 sprints");
        System.out.println("   - 12 tasks with various statuses");
        System.out.println("\n🔐 Users have been activated for login");
    }
}