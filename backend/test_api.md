# ScrumMasterBoard API Test Plan

## Test Endpoints

### 1. Test Project Endpoint
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/projects/1
```

### 2. Test Board Endpoint  
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" "http://localhost:8080/api/boards/scrum-master?projectId=1&sprintId=1"
```

### 3. Test Task Creation
```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" \
-d '{
  "title": "Test Task",
  "description": "Test Description", 
  "projectId": 1,
  "sprintId": 1,
  "type": "USER_STORY",
  "priority": "MEDIUM",
  "status": "TO_DO",
  "estimatedHours": 5,
  "dueDate": "2025-12-31T23:59:59"
}' http://localhost:8080/api/tasks
```

## Expected Results
- All endpoints should return 200 OK
- Board endpoint should return tasksByStatus object
- Task creation should return 201 Created with task object

[DEBUG] Fetching data for project ID: 1
ScrumMasterBoard.jsx:264 🔍 [DEBUG] Fetching data for project ID: 1
ScrumMasterBoard.jsx:274 📋 [DEBUG] Project data: {id: 1, name: 'E-commerce Platform', description: 'Complete online shopping platform with payment integration', key: 'ECOM', startDate: '2025-01-01T00:00:00', …}
ScrumMasterBoard.jsx:274 📋 [DEBUG] Project data: {id: 1, name: 'E-commerce Platform', description: 'Complete online shopping platform with payment integration', key: 'ECOM', startDate: '2025-01-01T00:00:00', …}
ScrumMasterBoard.jsx:305 🏃 [DEBUG] Sprints data: (2) [{…}, {…}]
ScrumMasterBoard.jsx:309 🎯 [DEBUG] Selected sprint: {id: 1, name: 'Sprint 15', goal: 'Complete payment integration and user profile features', startDate: '2025-01-08T00:00:00', endDate: '2025-01-22T00:00:00', …}
ScrumMasterBoard.jsx:318 📝 [DEBUG] Sprint tasks for progress: (3) [{…}, {…}, {…}]
ScrumMasterBoard.jsx:328 🔍 [DEBUG] Checking if tasks exist for project...
ScrumMasterBoard.jsx:305 🏃 [DEBUG] Sprints data: (2) [{…}, {…}]
ScrumMasterBoard.jsx:309 🎯 [DEBUG] Selected sprint: {id: 1, name: 'Sprint 15', goal: 'Complete payment integration and user profile features', startDate: '2025-01-08T00:00:00', endDate: '2025-01-22T00:00:00', …}
ScrumMasterBoard.jsx:318 📝 [DEBUG] Sprint tasks for progress: (3) [{…}, {…}, {…}]
ScrumMasterBoard.jsx:328 🔍 [DEBUG] Checking if tasks exist for project...
ScrumMasterBoard.jsx:335 📝 [DEBUG] Direct project tasks found: 4
ScrumMasterBoard.jsx:336 📝 [DEBUG] Sample tasks: (3) [{…}, {…}, {…}]
ScrumMasterBoard.jsx:353 🌐 [DEBUG] Using sprint-based API: http://localhost:8080/api/boards/scrum-master?sprintId=1&projectId=1
ScrumMasterBoard.jsx:335 📝 [DEBUG] Direct project tasks found: 4
ScrumMasterBoard.jsx:336 📝 [DEBUG] Sample tasks: (3) [{…}, {…}, {…}]
ScrumMasterBoard.jsx:353 🌐 [DEBUG] Using sprint-based API: http://localhost:8080/api/boards/scrum-master?sprintId=1&projectId=1
ScrumMasterBoard.jsx:368 📊 [DEBUG] Raw API Response: {stats: {…}, tasksByAssignee: {…}, tasksByStatus: {…}}
ScrumMasterBoard.jsx:369 📊 [DEBUG] API Response keys: (3) ['stats', 'tasksByAssignee', 'tasksByStatus']
ScrumMasterBoard.jsx:370 📊 [DEBUG] API Response JSON: {
"stats": {},
"tasksByAssignee": {},
"tasksByStatus": {}
}
ScrumMasterBoard.jsx:376 📁 [DEBUG] Using tasksByStatus from scrum master format
ScrumMasterBoard.jsx:378 📁 [DEBUG] tasksByStatus content: {}
ScrumMasterBoard.jsx:385 📋 [DEBUG] Extracted tasksByStatus: {}
ScrumMasterBoard.jsx:399 ✅ [DEBUG] Final tasksByStatus with defaults: {TO_DO: Array(0), IN_PROGRESS: Array(0), READY_FOR_TESTING: Array(0), IN_TESTING: Array(0), BUG_FOUND: Array(0), …}
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:492 🎯 [DEBUG] Final processed board data: {scrum: {…}, testing: {…}}
ScrumMasterBoard.jsx:493 📊 [DEBUG] Total processed tasks: 0
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column todo: {title: 'To Do', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column inProgress: {title: 'In Progress', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column review: {title: 'In Review', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column done: {title: 'Done', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:661 🔧 [DEBUG] Setting columns state with: {scrum: {…}, testing: {…}}
ScrumMasterBoard.jsx:672 ✅ [DEBUG] Columns state has been set
ScrumMasterBoard.jsx:1091 🎨 [DEBUG] Rendering board. boardType: scrum
ScrumMasterBoard.jsx:1092 🎨 [DEBUG] Available columns keys: (3) ['scrum', 'testing', 'current']
ScrumMasterBoard.jsx:1093 🎨 [DEBUG] Current board data: {columnOrder: Array(4), columns: {…}, tasks: {…}}
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: todo
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'todo', title: 'To Do', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column todo has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: inProgress
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'inProgress', title: 'In Progress', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column inProgress has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: review
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'review', title: 'In Review', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column review has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: done
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'done', title: 'Done', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column done has 0 tasks
ScrumMasterBoard.jsx:1159 Modal state - showTaskModal: false selectedTask: undefined
ScrumMasterBoard.jsx:1091 🎨 [DEBUG] Rendering board. boardType: scrum
ScrumMasterBoard.jsx:1092 🎨 [DEBUG] Available columns keys: (3) ['scrum', 'testing', 'current']
ScrumMasterBoard.jsx:1093 🎨 [DEBUG] Current board data: {columnOrder: Array(4), columns: {…}, tasks: {…}}
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: todo
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'todo', title: 'To Do', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column todo has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: inProgress
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'inProgress', title: 'In Progress', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column inProgress has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: review
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'review', title: 'In Review', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column review has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: done
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'done', title: 'Done', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column done has 0 tasks
ScrumMasterBoard.jsx:1159 Modal state - showTaskModal: false selectedTask: undefined
ScrumMasterBoard.jsx:368 📊 [DEBUG] Raw API Response: {stats: {…}, tasksByAssignee: {…}, tasksByStatus: {…}}
ScrumMasterBoard.jsx:369 📊 [DEBUG] API Response keys: (3) ['stats', 'tasksByAssignee', 'tasksByStatus']
ScrumMasterBoard.jsx:370 📊 [DEBUG] API Response JSON: {
"stats": {},
"tasksByAssignee": {},
"tasksByStatus": {}
}
ScrumMasterBoard.jsx:376 📁 [DEBUG] Using tasksByStatus from scrum master format
ScrumMasterBoard.jsx:378 📁 [DEBUG] tasksByStatus content: {}
ScrumMasterBoard.jsx:385 📋 [DEBUG] Extracted tasksByStatus: {}
ScrumMasterBoard.jsx:399 ✅ [DEBUG] Final tasksByStatus with defaults: {TO_DO: Array(0), IN_PROGRESS: Array(0), READY_FOR_TESTING: Array(0), IN_TESTING: Array(0), BUG_FOUND: Array(0), …}
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:406 🔄 [DEBUG] Processing tasks for column: []
ScrumMasterBoard.jsx:432 ✅ [DEBUG] Generated task IDs for column: []
ScrumMasterBoard.jsx:492 🎯 [DEBUG] Final processed board data: {scrum: {…}, testing: {…}}
ScrumMasterBoard.jsx:493 📊 [DEBUG] Total processed tasks: 0
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column todo: {title: 'To Do', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column inProgress: {title: 'In Progress', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column review: {title: 'In Review', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:498 📋 [DEBUG] Column done: {title: 'Done', taskCount: 0, taskIds: Array(0)}
ScrumMasterBoard.jsx:661 🔧 [DEBUG] Setting columns state with: {scrum: {…}, testing: {…}}
ScrumMasterBoard.jsx:672 ✅ [DEBUG] Columns state has been set
ScrumMasterBoard.jsx:1091 🎨 [DEBUG] Rendering board. boardType: scrum
ScrumMasterBoard.jsx:1092 🎨 [DEBUG] Available columns keys: (3) ['scrum', 'testing', 'current']
ScrumMasterBoard.jsx:1093 🎨 [DEBUG] Current board data: {columnOrder: Array(4), columns: {…}, tasks: {…}}columnOrder: (4) ['todo', 'inProgress', 'review', 'done']columns: {todo: {…}, inProgress: {…}, review: {…}, done: {…}}tasks: {}[[Prototype]]: Object
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: todo
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'todo', title: 'To Do', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column todo has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: inProgress
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'inProgress', title: 'In Progress', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column inProgress has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: review
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'review', title: 'In Review', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column review has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: done
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'done', title: 'Done', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column done has 0 tasks
ScrumMasterBoard.jsx:1159 Modal state - showTaskModal: false selectedTask: undefined
ScrumMasterBoard.jsx:1091 🎨 [DEBUG] Rendering board. boardType: scrum
ScrumMasterBoard.jsx:1092 🎨 [DEBUG] Available columns keys: (3) ['scrum', 'testing', 'current']
ScrumMasterBoard.jsx:1093 🎨 [DEBUG] Current board data: {columnOrder: Array(4), columns: {…}, tasks: {…}}
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: todo
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'todo', title: 'To Do', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column todo has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: inProgress
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'inProgress', title: 'In Progress', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column inProgress has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: review
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'review', title: 'In Review', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column review has 0 tasks
ScrumMasterBoard.jsx:1096 🎨 [DEBUG] Rendering column: done
ScrumMasterBoard.jsx:1103 🎨 [DEBUG] Column data: {id: 'done', title: 'Done', taskIds: Array(0)}
ScrumMasterBoard.jsx:1113 🎨 [DEBUG] Column done has 0 tasks
ScrumMasterBoard.jsx:1159 Modal state - showTaskModal: false selectedTask: undefined