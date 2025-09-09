import requests
import json

# Base URL for the API
base_url = "http://localhost:8080/api"

# First, activate users so they can login
def activate_users():
    # Since we can't update users directly via API, we'll just proceed with login attempts
    pass

# Login to get authentication token
def login():
    login_data = {
        "email": "edisonzyberaj@gmail.com",  # Using existing user
        "password": "password123"
    }
    
    response = requests.post(f"{base_url}/auth/login", json=login_data)
    print(f"Login response: {response.status_code}")
    print(f"Response body: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        return data.get('token')
    return None

# Create sprints for existing projects
def create_sprints(token):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    sprints = [
        {
            "name": "Sprint 1",
            "goal": "Complete user authentication and basic features",
            "projectId": 3,
            "startDate": "2025-01-01T00:00:00",
            "endDate": "2025-01-14T00:00:00",
            "status": "COMPLETED"
        },
        {
            "name": "Sprint 2", 
            "goal": "Implement core functionalities",
            "projectId": 3,
            "startDate": "2025-01-15T00:00:00",
            "endDate": "2025-01-28T00:00:00",
            "status": "ACTIVE"
        },
        {
            "name": "Sprint 1",
            "goal": "Setup IoT dashboard foundation", 
            "projectId": 4,
            "startDate": "2025-01-01T00:00:00",
            "endDate": "2025-01-14T00:00:00",
            "status": "ACTIVE"
        }
    ]
    
    created_sprints = []
    for sprint in sprints:
        response = requests.post(f"{base_url}/sprints", json=sprint, headers=headers)
        print(f"Sprint creation response: {response.status_code}")
        if response.status_code == 201:
            created_sprints.append(response.json())
        else:
            print(f"Failed to create sprint: {response.text}")
    
    return created_sprints

# Create tasks
def create_tasks(token, sprints):
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Find sprint IDs
    sprint_1_p3 = next((s['id'] for s in sprints if s['name'] == 'Sprint 1' and s['projectId'] == 3), None)
    sprint_2_p3 = next((s['id'] for s in sprints if s['name'] == 'Sprint 2' and s['projectId'] == 3), None) 
    sprint_1_p4 = next((s['id'] for s in sprints if s['name'] == 'Sprint 1' and s['projectId'] == 4), None)
    
    tasks = [
        # Tasks for E-commerce Platform (project 3)
        {
            "title": "User Registration API",
            "description": "Implement REST API endpoints for user registration with validation",
            "type": "USER_STORY",
            "priority": "HIGH", 
            "status": "DONE",
            "estimatedHours": 8,
            "dueDate": "2025-01-10T00:00:00",
            "projectId": 3,
            "sprintId": sprint_1_p3,
            "assigneeId": 1,
            "acceptanceCriteria": "- API should validate email format\n- Password should meet security requirements\n- Return proper error messages"
        },
        {
            "title": "Login Authentication", 
            "description": "Implement JWT-based authentication system",
            "type": "USER_STORY",
            "priority": "HIGH",
            "status": "DONE", 
            "estimatedHours": 6,
            "dueDate": "2025-01-12T00:00:00",
            "projectId": 3,
            "sprintId": sprint_1_p3,
            "assigneeId": 1,
            "acceptanceCriteria": "- Generate JWT tokens\n- Validate credentials\n- Handle token expiration"
        },
        {
            "title": "Product Search API",
            "description": "Implement search functionality with filters", 
            "type": "USER_STORY",
            "priority": "HIGH",
            "status": "IN_PROGRESS",
            "estimatedHours": 12,
            "dueDate": "2025-01-25T00:00:00",
            "projectId": 3,
            "sprintId": sprint_2_p3,
            "assigneeId": 8,
            "acceptanceCriteria": "- Search by product name\n- Filter by category\n- Sort results"
        },
        {
            "title": "Product Catalog Frontend",
            "description": "Build React components for product browsing",
            "type": "USER_STORY", 
            "priority": "HIGH",
            "status": "TO_DO",
            "estimatedHours": 10,
            "dueDate": "2025-01-27T00:00:00",
            "projectId": 3,
            "sprintId": sprint_2_p3,
            "assigneeId": 9,
            "acceptanceCriteria": "- Responsive grid layout\n- Product card components\n- Pagination support"
        },
        {
            "title": "Shopping Cart Implementation",
            "description": "Add to cart and cart management functionality",
            "type": "USER_STORY",
            "priority": "MEDIUM", 
            "status": "TO_DO",
            "estimatedHours": 8,
            "dueDate": "2025-01-28T00:00:00",
            "projectId": 3,
            "sprintId": sprint_2_p3,
            "acceptanceCriteria": "- Add/remove items from cart\n- Update quantities\n- Calculate totals"
        },
        {
            "title": "Fix product image loading",
            "description": "Product images not displaying correctly on mobile",
            "type": "BUG",
            "priority": "HIGH",
            "status": "READY_FOR_TESTING", 
            "estimatedHours": 2,
            "dueDate": "2025-01-20T00:00:00",
            "projectId": 3,
            "sprintId": sprint_2_p3,
            "assigneeId": 8,
            "acceptanceCriteria": "- Images should load on all devices\n- Proper fallback handling\n- Optimize loading performance"
        },
        # Tasks for IoT Dashboard (project 4)
        {
            "title": "Dashboard Layout Design",
            "description": "Create responsive dashboard layout",
            "type": "USER_STORY",
            "priority": "HIGH",
            "status": "IN_PROGRESS",
            "estimatedHours": 6,
            "dueDate": "2025-01-12T00:00:00", 
            "projectId": 4,
            "sprintId": sprint_1_p4,
            "assigneeId": 9,
            "acceptanceCriteria": "- Responsive design\n- Grid-based layout\n- Mobile-friendly"
        },
        {
            "title": "Device Connection API", 
            "description": "Implement IoT device connection endpoints",
            "type": "USER_STORY",
            "priority": "HIGH",
            "status": "TO_DO",
            "estimatedHours": 8,
            "dueDate": "2025-01-14T00:00:00",
            "projectId": 4, 
            "sprintId": sprint_1_p4,
            "assigneeId": 8,
            "acceptanceCriteria": "- Connect to IoT devices\n- Handle device authentication\n- Real-time data streaming"
        }
    ]
    
    created_tasks = []
    for task in tasks:
        response = requests.post(f"{base_url}/tasks", json=task, headers=headers)
        print(f"Task '{task['title']}' creation response: {response.status_code}")
        if response.status_code == 201:
            created_tasks.append(response.json())
        else:
            print(f"Failed to create task '{task['title']}': {response.text}")
    
    return created_tasks

def main():
    print("Adding sample data to ScrumHub...")
    
    # Try to login (this will fail if users are inactive, but we'll proceed)
    token = login()
    
    if not token:
        print("Login failed - users might be inactive or password incorrect")
        print("You'll need to manually activate users in the database first")
        return
    
    # Create sprints
    print("\nCreating sprints...")
    sprints = create_sprints(token)
    
    # Create tasks  
    print("\nCreating tasks...")
    tasks = create_tasks(token, sprints)
    
    print(f"\nCompleted! Created {len(sprints)} sprints and {len(tasks)} tasks.")

if __name__ == "__main__":
    main()