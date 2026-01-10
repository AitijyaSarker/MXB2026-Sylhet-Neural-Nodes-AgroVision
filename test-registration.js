import fetch from 'node-fetch';

async function testRegistration() {
  try {
    console.log('🧪 Testing User Registration...');
    console.log('==============================');

    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Farmer',
        email: 'test@example.com',
        password: 'password123',
        role: 'farmer'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registration successful!');
      console.log('📧 Email:', data.user.email);
      console.log('👤 Name:', data.user.name);
      console.log('🔑 Token received:', data.token ? 'Yes' : 'No');
      console.log('🆔 User ID:', data.user.id);
    } else {
      console.log('❌ Registration failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testRegistration();