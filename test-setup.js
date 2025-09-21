import fetch from 'node-fetch';

const testAPI = async () => {
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // Test products endpoint
    console.log('1. Testing products endpoint...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`✅ Products endpoint working - Found ${products.length} products`);
    } else {
      console.log('❌ Products endpoint failed');
    }
    
    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerResponse = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log('✅ User registration working');
      console.log(`   User ID: ${userData.user.id}`);
      console.log(`   Token: ${userData.token.substring(0, 20)}...`);
    } else {
      console.log('❌ User registration failed');
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure MongoDB is running and the server is started');
  }
};

testAPI();
