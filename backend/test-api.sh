#!/bin/bash
# ScrumHub API Test Script
# Make sure backend server is running on localhost:8080

echo "🚀 Testing ScrumHub API..."

# 1. Register a Scrum Master
echo "1. Registering Scrum Master..."
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.scrummaster@example.com", 
    "password": "password123",
    "role": "SCRUM_MASTER"
  }'

echo -e "\n\n2. Logging in..."
# 2. Login and extract token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.scrummaster@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE

# Extract token (you'll need to manually copy this for subsequent requests)
echo -e "\n\n⚠️  Copy the token from above and use it in the following requests:"

echo -e "\n3. Test create project (replace YOUR_TOKEN with actual token):"
echo "curl -X POST http://localhost:8080/api/projects \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Authorization: Bearer YOUR_TOKEN\" \\"
echo "  -d '{"
echo "    \"name\": \"E-commerce Platform\","
echo "    \"description\": \"Complete e-commerce solution\","
echo "    \"key\": \"ECOM\","
echo "    \"startDate\": \"2024-01-15T00:00:00\","
echo "    \"endDate\": \"2024-06-15T00:00:00\""
echo "  }'"

echo -e "\n4. Test get all projects:"
echo "curl -X GET http://localhost:8080/api/projects -H \"Authorization: Bearer YOUR_TOKEN\""