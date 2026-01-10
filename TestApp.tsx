import React from 'react';

// Function to setup test data (call this from browser console)
(window as any).setupTestData = () => {
  const STORAGE_KEYS = {
    users: 'agrovision_users',
    messages: 'agrovision_messages',
    scans: 'agrovision_scans'
  };

  // Clear existing data
  localStorage.removeItem(STORAGE_KEYS.users);
  localStorage.removeItem(STORAGE_KEYS.messages);
  localStorage.removeItem(STORAGE_KEYS.scans);

  // Add test users
  const testUsers = [
    {
      _id: 'farmer1',
      email: 'farmer1@example.com',
      name: 'John Farmer',
      role: 'farmer',
      avatar: 'https://picsum.photos/100/100?q=john',
      createdAt: new Date()
    },
    {
      _id: 'farmer2',
      email: 'farmer2@example.com',
      name: 'Jane Farmer',
      role: 'farmer',
      avatar: 'https://picsum.photos/100/100?q=jane',
      createdAt: new Date()
    },
    {
      _id: 'specialist1',
      email: 'specialist1@example.com',
      name: 'Dr. Smith',
      role: 'specialist',
      avatar: 'https://picsum.photos/100/100?q=smith',
      createdAt: new Date()
    },
    {
      _id: 'specialist2',
      email: 'specialist2@example.com',
      name: 'Dr. Johnson',
      role: 'specialist',
      avatar: 'https://picsum.photos/100/100?q=johnson',
      createdAt: new Date()
    }
  ];

  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(testUsers));

  // Add some test messages
  const testMessages = [
    {
      _id: 'msg1',
      conversationId: 'farmer1-specialist1',
      senderId: 'farmer1',
      text: 'Hello Dr. Smith, I have a problem with my tomato plants.',
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      _id: 'msg2',
      conversationId: 'farmer1-specialist1',
      senderId: 'specialist1',
      text: 'Hi John! Can you describe the symptoms you\'re seeing?',
      createdAt: new Date(Date.now() - 3300000) // 55 minutes ago
    },
    {
      _id: 'msg3',
      conversationId: 'farmer2-specialist2',
      senderId: 'farmer2',
      text: 'My corn crops are showing yellow spots.',
      createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      _id: 'msg4',
      conversationId: 'farmer2-specialist2',
      senderId: 'specialist2',
      text: 'That sounds like corn blight. Let me help you with treatment options.',
      createdAt: new Date(Date.now() - 1500000) // 25 minutes ago
    }
  ];

  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(testMessages));

  console.log('✅ Test data initialized successfully!');
  console.log('Users:', testUsers.length);
  console.log('Messages:', testMessages.length);
  alert('Test data setup complete! Refresh the page to see the changes.');
};

const TestApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">AgroVision Test</h1>
        <p className="text-lg text-gray-600 mb-4">Basic React is working!</p>
        <button
          onClick={() => {
            console.log('Test button clicked');
            alert('React is working correctly!');
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Button
        </button>
        <div className="mt-4">
          <button
            onClick={() => {
              // Test setupTestData function
              if ((window as any).setupTestData) {
                (window as any).setupTestData();
              } else {
                alert('setupTestData function not found');
              }
            }}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Setup Test Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestApp;