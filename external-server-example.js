/**
 * Example: How another server can access this employee API
 * Save this as: external-server-example.js
 * Run with: node external-server-example.js
 */

const API_BASE_URL = 'http://localhost:8080';
const API_SECRET_KEY = 'sakib'; // Get from .env

// Example 1: Using native fetch (Node.js 18+)
async function getEmployeesWithFetch() {
  console.log('=== Using Fetch API ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        'x-api-key': API_SECRET_KEY
      }
    });
    
    if (response.ok) {
      const employees = await response.json();
      console.log('✅ Success! Employees:', employees);
      return employees;
    } else {
      const error = await response.json();
      console.error('❌ Error:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    return null;
  }
}

// Example 2: Using axios (npm install axios)
async function getEmployeesWithAxios() {
  console.log('\n=== Using Axios ===');
  
  try {
    const axios = require('axios');
    
    const response = await axios.get(`${API_BASE_URL}/employees`, {
      headers: {
        'x-api-key': API_SECRET_KEY
      }
    });
    
    console.log('✅ Success! Employees:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Error:', error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
    return null;
  }
}

// Example 3: Get single employee by ID
async function getEmployeeById(id) {
  console.log(`\n=== Getting Employee ID: ${id} ===`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_SECRET_KEY
      }
    });
    
    if (response.ok) {
      const employee = await response.json();
      console.log('✅ Success! Employee:', employee);
      return employee;
    } else {
      const error = await response.json();
      console.error('❌ Error:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    return null;
  }
}

// Example 4: Error handling - Invalid API Key
async function testInvalidApiKey() {
  console.log('\n=== Testing Invalid API Key ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        'x-api-key': 'wrong-api-key'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Unexpected success:', data);
    } else {
      console.log('❌ Expected error:', data);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

// Run all examples
async function main() {
  console.log('🚀 Starting External Server API Test\n');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`API Key: ${API_SECRET_KEY}\n`);
  console.log('='.repeat(50));
  
  // Test 1: Get all employees with fetch
  await getEmployeesWithFetch();
  
  // Test 2: Get all employees with axios (if installed)
  // Uncomment if you have axios installed
  // await getEmployeesWithAxios();
  
  // Test 3: Get single employee
  await getEmployeeById(1);
  
  // Test 4: Test invalid API key
  await testInvalidApiKey();
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!');
}

// Run the examples
main().catch(console.error);
