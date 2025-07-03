import React, { useState, useEffect } from 'react';
import { User, LogOut, FileText, Users, CheckCircle, AlertCircle, Calendar, Search, Download, Archive, Eye, Trash2 } from 'lucide-react';

const RecruitmentDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('questions');
  const [interviews, setInterviews] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [viewingCompletedInterview, setViewingCompletedInterview] = useState(null);
  const [responses, setResponses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCandidateModal, setShowNewCandidateModal] = useState(false);
  const [ghlSyncStatus, setGhlSyncStatus] = useState(null);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showWebhookSettings, setShowWebhookSettings] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState(null);
  const [apiSettings, setApiSettings] = useState({
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6Ild6SWtZMk1hazBHbWlJdktVRHVYIiwidmVyc2lvbiI6MSwiaWF0IjoxNzUxMzE0MDg5NTIxLCJzdWIiOiJNeEdsQTVtUk1QbzVhYTNxN0E4VSJ9.xNVqp7BPmG25ixQuXlMjvGhdZYvU7DGakTLryRWH-bA',
    locationId: 'WzIkY2Mak0GmiIvKUDuX',
    webhookUrl: '',
    useWebhook: true
  });
  const [newCandidateForm, setNewCandidateForm] = useState({
    candidateName: '',
    email: '',
    phone: '',
    position: 'Insurance Agent',
    interviewDate: '',
    notes: ''
  });

  // GoHighLevel API Configuration (now using state)
  const GHL_API_BASE = 'https://services.leadconnectorhq.com';

  // Agent interview questions organized by category
  const interviewQuestions = {
    'Culture & Background': [
      'What research did you do about Main Line Benefits?',
      'Walk us through your past 3 positions and what results you were responsible for in each role.',
      'What professional goals would you like to accomplish over the next 5 years?',
      'What are your income expectations for this role?',
      'What does a good day look like for you? How do you show up on difficult days?',
      'Why are you looking for a new opportunity?'
    ],
    'Core Value: Team Player': [
      'Can you describe a time when you had to collaborate with a difficult team member? How do you handle disagreements? How did you handle the situation, and what was the outcome?',
      'Tell me about a successful team project you worked on. What role did you play, and how did your contributions impact the team\'s success?',
      'Describe a situation where your team faced a challenge. How did you work together to overcome it?'
    ],
    'Core Value: Do What\'s Right': [
      'Can you tell me about a time you went out of your way for a client just because it felt like the right thing to do? What happened, and how did you make sure they were taken care of?',
      'If a client isn\'t happy with something, how do you usually handle it? What\'s your approach to making things right while staying honest and respectful?',
      'How do you juggle hitting business goals while still doing what\'s best for the client? Can you think of a time when you had to make a tough call and chose to do what was right?'
    ],
    'Core Value: Be the Expert': [
      'Tell me about a time when you faced a major obstacle at work. How did you approach the problem, and what was the outcome?',
      'Describe a situation where you had limited resources or information but still had to achieve a goal. How did you adapt and succeed?',
      'Can you share an instance when a project or task didn\'t go as planned? What steps did you take to pivot and still deliver results?'
    ],
    'Closing Questions': [
      'Why should we hire you?',
      'What questions do you have for us?'
    ]
  };

  // Sample users for demo
  const users = {
    'recruiter1': { password: 'pass123', role: 'recruiter', name: 'Sarah Johnson' },
    'sales1': { password: 'pass123', role: 'sales', name: 'Mike Chen' },
    'admin1': { password: 'admin123', role: 'admin', name: 'Alex Rivera' }
  };

  // Initialize sample data and load completed interviews from localStorage
  useEffect(() => {
    const sampleInterviews = [
      {
        id: 1,
        candidateName: 'Sarah Thompson',
        position: 'Insurance Agent',
        email: 'sarah.thompson@email.com',
        phone: '+1-555-0123',
        interviewer: 'Sarah Johnson',
        date: '2025-06-28',
        status: 'completed',
        notes: 'Strong candidate with excellent communication skills',
        responses: {
          'Culture & Background': {
            'What research did you do about Main Line Benefits?': 'I researched your company\'s 25-year history, your focus on personalized service, and your strong reputation in the Philadelphia area.',
            'Walk us through your past 3 positions and what results you were responsible for in each role.': 'At State Farm, I exceeded sales targets by 120% and maintained 95% client retention.'
          },
          'Core Value: Team Player': {
            'Can you describe a time when you had to collaborate with a difficult team member? How do you handle disagreements? How did you handle the situation, and what was the outcome?': '+',
            'Tell me about a successful team project you worked on. What role did you play, and how did your contributions impact the team\'s success?': '+/-'
          }
        }
      },
      {
        id: 2,
        candidateName: 'Michael Rodriguez',
        position: 'Insurance Agent',
        email: 'michael.rodriguez@email.com',
        phone: '+1-555-0124',
        interviewer: 'Mike Chen',
        date: '2025-06-29',
        status: 'in-progress',
        notes: 'Promising candidate, needs to complete core values assessment',
        responses: {}
      }
    ];
    setInterviews(sampleInterviews);

    // Load completed interviews from localStorage
    const savedCompletedInterviews = localStorage.getItem('completedInterviews');
    if (savedCompletedInterviews) {
      setCompletedInterviews(JSON.parse(savedCompletedInterviews));
    }
  }, []);

  // Save completed interviews to localStorage whenever they change
  useEffect(() => {
    if (completedInterviews.length > 0) {
      localStorage.setItem('completedInterviews', JSON.stringify(completedInterviews));
    }
  }, [completedInterviews]);

  // Generate PDF function
  const generatePDF = (interview) => {
    // Create a formatted HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Interview Report - ${interview.candidateName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #004785;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .header p {
            margin: 5px 0;
            font-size: 14px;
          }
          .info-section {
            background-color: #f5f5f5;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            color: #004785;
          }
          .category {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .category-title {
            background-color: #009FDA;
            color: white;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: bold;
          }
          .question {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #009FDA;
          }
          .question-text {
            font-weight: bold;
            color: #004785;
            margin-bottom: 10px;
          }
          .response {
            color: #333;
            white-space: pre-wrap;
          }
          .score {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            margin-top: 5px;
          }
          .score-excellent {
            background-color: #d4edda;
            color: #155724;
          }
          .score-average {
            background-color: #fff3cd;
            color: #856404;
          }
          .score-poor {
            background-color: #f8d7da;
            color: #721c24;
          }
          .notes-section {
            margin-top: 30px;
            padding: 20px;
            background-color: #e9ecef;
            border-radius: 5px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
              padding: 10px;
            }
            .header {
              margin-bottom: 20px;
            }
            .category {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Main Line Benefits</h1>
          <p>Agent Interview Report</p>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Candidate Name:</span>
            <span>${interview.candidateName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Position:</span>
            <span>${interview.position}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span>${interview.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span>${interview.phone || 'Not provided'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Interview Date:</span>
            <span>${interview.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Interviewer:</span>
            <span>${interview.interviewer}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span>${interview.status}</span>
          </div>
        </div>

        ${Object.entries(interview.responses).map(([category, categoryResponses]) => `
          <div class="category">
            <div class="category-title">${category}</div>
            ${Object.entries(categoryResponses).map(([question, answer]) => `
              <div class="question">
                <div class="question-text">${question}</div>
                <div class="response">
                  ${category.includes('Core Value') && (answer === '+' || answer === '+/-' || answer === '-') ? 
                    `<span class="score ${answer === '+' ? 'score-excellent' : answer === '+/-' ? 'score-average' : 'score-poor'}">
                      ${answer === '+' ? '+ Excellent' : answer === '+/-' ? '+/- Average' : '- Poor'}
                    </span>` : 
                    answer}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}

        ${interview.notes ? `
          <div class="notes-section">
            <h3>Interview Notes</h3>
            <p>${interview.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>This document is confidential and for internal use only.</p>
          <p>&copy; ${new Date().getFullYear()} Main Line Benefits. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print dialog
    printWindow.onload = function() {
      printWindow.print();
      // Optional: close the window after printing
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

  // Delete completed interview
  const deleteCompletedInterview = (interviewId) => {
    if (window.confirm('Are you sure you want to delete this completed interview? This action cannot be undone.')) {
      const updatedCompleted = completedInterviews.filter(i => i.id !== interviewId);
      setCompletedInterviews(updatedCompleted);
      setViewingCompletedInterview(null);
    }
  };

  // Test webhook function
  const testWebhook = async () => {
    if (!apiSettings.webhookUrl || apiSettings.webhookUrl.trim() === '') {
      setWebhookTestStatus({ 
        status: 'error', 
        message: 'Please enter a webhook URL first!' 
      });
      return;
    }

    try {
      setWebhookTestStatus({ status: 'testing', message: 'Sending test request...' });

      const testData = {
        // Test candidate data
        candidateName: 'Test Candidate',
        firstName: 'Test',
        lastName: 'Candidate',
        email: 'test@example.com',
        phone: '+1-555-TEST',
        position: 'Insurance Agent',
        
        // Test interview metadata
        interviewer: currentUser.name,
        interviewDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        notes: 'This is a test webhook request from the Agent Interview Dashboard',
        
        // GoHighLevel fields
        locationId: apiSettings.locationId,
        tags: ['Agent-Candidate', 'webhook-test'],
        
        // Test core values
        coreValues: {
          team_player: {
            score: '+',
            label: 'Excellent',
            question: 'Test team collaboration question'
          },
          do_whats_right: {
            score: '+/-',
            label: 'Average', 
            question: 'Test ethical decision question'
          },
          be_the_expert: {
            score: '+',
            label: 'Excellent',
            question: 'Test problem-solving question'
          }
        },
        
        // Test responses
        responses: {
          'Culture & Background': {
            'What research did you do about Main Line Benefits?': 'This is a test response about company research.',
            'Why are you looking for a new opportunity?': 'This is a test response about career goals.'
          }
        },
        
        // Test metadata
        isTest: true,
        testTimestamp: new Date().toISOString(),
        dashboardUser: currentUser.name
      };

      console.log('Testing webhook URL:', apiSettings.webhookUrl);
      console.log('Sending test webhook data:', JSON.stringify(testData, null, 2));

      const response = await fetch(apiSettings.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('Webhook response status:', response.status);
      console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Webhook response body:', responseText);

      if (!response.ok) {
        let errorDetails = `Status: ${response.status} ${response.statusText}`;
        if (responseText) {
          errorDetails += `\nResponse: ${responseText}`;
        }
        
        // Specific error handling
        if (response.status === 404) {
          errorDetails += '\n\nPossible issues:\n• Webhook URL might be incorrect\n• Webhook might be disabled in GoHighLevel';
        } else if (response.status === 401 || response.status === 403) {
          errorDetails += '\n\nPossible issues:\n• Authentication/authorization problem\n• Check webhook permissions in GoHighLevel';
        } else if (response.status === 500) {
          errorDetails += '\n\nPossible issues:\n• Server error in GoHighLevel\n• Webhook configuration problem';
        }
        
        throw new Error(errorDetails);
      }

      setWebhookTestStatus({ 
        status: 'success', 
        message: `✅ Webhook test successful! Status: ${response.status} ${response.statusText}`,
        details: responseText || 'No response body'
      });

    } catch (error) {
      console.error('Webhook test error:', error);
      
      let userFriendlyMessage = error.message;
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        userFriendlyMessage = 'Network error - this could be due to:\n• CORS policy blocking the request\n• Invalid webhook URL\n• Network connectivity issues\n\nTry testing with a tool like Postman or curl instead.';
      }
      
      setWebhookTestStatus({ 
        status: 'error', 
        message: `❌ Webhook test failed: ${userFriendlyMessage}` 
      });
    }
  };

  // Webhook sync method (recommended approach)
  const syncToWebhook = async (interview) => {
    try {
      setGhlSyncStatus({ status: 'syncing', message: 'Syncing to GoHighLevel via webhook...' });

      const webhookData = {
        // Contact Information
        candidateName: interview.candidateName,
        firstName: interview.candidateName.split(' ')[0] || interview.candidateName,
        lastName: interview.candidateName.split(' ').slice(1).join(' ') || '',
        email: interview.email,
        phone: interview.phone,
        position: interview.position,
        
        // Interview Metadata
        interviewer: interview.interviewer,
        interviewDate: interview.date,
        status: interview.status,
        notes: interview.notes || '',
        
        // GoHighLevel Fields
        locationId: apiSettings.locationId,
        tags: ['Agent-Candidate'],
        
        // Core Values Scores
        coreValues: {},
        
        // Detailed Responses
        responses: {},
        
        // Timestamp
        syncTimestamp: new Date().toISOString()
      };

      // Process Core Values scores
      const coreValueCategories = ['Core Value: Team Player', 'Core Value: Do What\'s Right', 'Core Value: Be the Expert'];
      coreValueCategories.forEach(category => {
        if (interview.responses[category]) {
          Object.entries(interview.responses[category]).forEach(([question, score]) => {
            if (score === '+' || score === '+/-' || score === '-') {
              const fieldName = category.replace('Core Value: ', '').replace(/\s+/g, '_').toLowerCase();
              
              // Add as tag
              webhookData.tags.push(`${fieldName}-${score === '+' ? 'excellent' : score === '+/-' ? 'average' : 'poor'}`);
              
              // Add as structured data
              webhookData.coreValues[fieldName] = {
                score: score,
                label: score === '+' ? 'Excellent' : score === '+/-' ? 'Average' : 'Poor',
                question: question
              };
            }
          });
        }
      });

      // Process text responses
      Object.entries(interview.responses).forEach(([category, categoryResponses]) => {
        if (category.includes('Culture & Background') || category.includes('Closing Questions')) {
          webhookData.responses[category] = categoryResponses;
        }
      });

      console.log('Webhook payload:', JSON.stringify(webhookData, null, 2));

      if (!apiSettings.webhookUrl || apiSettings.webhookUrl.trim() === '') {
        setGhlSyncStatus({ 
          status: 'error', 
          message: 'Please configure webhook URL in Webhook Settings first!' 
        });
        return;
      }

      const webhookResponse = await fetch(apiSettings.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!webhookResponse.ok) {
        throw new Error(`Webhook failed: ${webhookResponse.status} - ${webhookResponse.statusText}`);
      }

      setGhlSyncStatus({ 
        status: 'success', 
        message: `Successfully sent ${interview.candidateName} data to GoHighLevel webhook!`,
        contactId: 'webhook-processed'
      });

      return { success: true, data: webhookData };
    } catch (error) {
      console.error('Webhook sync error:', error);
      setGhlSyncStatus({ 
        status: 'error', 
        message: `Webhook sync failed: ${error.message}` 
      });
      throw error;
    }
  };

  // Main sync function - now uses webhook by default
  const syncToGoHighLevel = async (interview) => {
    if (apiSettings.useWebhook) {
      return await syncToWebhook(interview);
    }
    
    // Fallback to direct API (keeping old code for reference)
    try {
      setGhlSyncStatus({ status: 'syncing', message: 'Syncing to GoHighLevel...' });

      const contactData = {
        firstName: interview.candidateName.split(' ')[0] || interview.candidateName,
        lastName: interview.candidateName.split(' ').slice(1).join(' ') || '',
        email: interview.email,
        phone: interview.phone,
        locationId: apiSettings.locationId,
        tags: ['Agent-Candidate']
      };

      const coreValueCategories = ['Core Value: Team Player', 'Core Value: Do What\'s Right', 'Core Value: Be the Expert'];
      coreValueCategories.forEach(category => {
        if (interview.responses[category]) {
          Object.entries(interview.responses[category]).forEach(([question, score]) => {
            if (score === '+' || score === '+/-' || score === '-') {
              const fieldName = category.replace('Core Value: ', '');
              contactData.tags.push(`${fieldName.replace(/\s+/g, '-')}-${score === '+' ? 'Plus' : score === '+/-' ? 'Average' : 'Poor'}`);
            }
          });
        }
      });

      const contactResponse = await fetch(`${GHL_API_BASE}/contacts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiSettings.apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        },
        body: JSON.stringify(contactData)
      });

      if (!contactResponse.ok) {
        console.log('Direct API failed, falling back to webhook...');
        return await syncToWebhook(interview);
      }

      const contact = await contactResponse.json();
      setGhlSyncStatus({ 
        status: 'success', 
        message: `Successfully synced ${interview.candidateName} to GoHighLevel!`,
        contactId: contact.contact?.id || contact.id
      });

      return contact;
    } catch (error) {
      console.error('API sync failed, trying webhook...', error);
      return await syncToWebhook(interview);
    }
  };

  const createNewCandidate = () => {
    if (!newCandidateForm.candidateName || !newCandidateForm.email) {
      alert('Please fill in candidate name and email address (required fields)');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCandidateForm.email)) {
      alert('Please enter a valid email address');
      return;
    }

    const newInterview = {
      id: Date.now(), // Use timestamp for unique ID
      candidateName: newCandidateForm.candidateName,
      position: newCandidateForm.position,
      email: newCandidateForm.email,
      phone: newCandidateForm.phone,
      interviewer: currentUser.name,
      date: newCandidateForm.interviewDate || new Date().toISOString().split('T')[0],
      status: 'scheduled',
      notes: newCandidateForm.notes,
      responses: {}
    };

    setInterviews([...interviews, newInterview]);
    setNewCandidateForm({
      candidateName: '',
      email: '',
      phone: '',
      position: 'Insurance Agent',
      interviewDate: '',
      notes: ''
    });
    setShowNewCandidateModal(false);
    alert('New candidate added successfully!');
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    console.log('Login attempt:', loginForm.username);
    const user = users[loginForm.username];
    if (user && user.password === loginForm.password) {
      console.log('Login successful');
      setCurrentUser({ ...user, username: loginForm.username });
      setLoginForm({ username: '', password: '' });
    } else {
      console.log('Login failed');
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedInterview(null);
    setViewingCompletedInterview(null);
    setResponses({});
    setActiveTab('questions');
    setShowNewCandidateModal(false);
    setGhlSyncStatus(null);
  };

  const saveResponse = (category, question, answer) => {
    if (!selectedInterview) return;
    
    const updatedInterviews = interviews.map(interview => {
      if (interview.id === selectedInterview.id) {
        return {
          ...interview,
          responses: {
            ...interview.responses,
            [category]: {
              ...interview.responses[category],
              [question]: answer
            }
          },
          status: 'in-progress'
        };
      }
      return interview;
    });
    
    setInterviews(updatedInterviews);
    setSelectedInterview(updatedInterviews.find(i => i.id === selectedInterview.id));
  };

  const completeInterview = async () => {
    if (!selectedInterview) return;
    
    // Update interview status
    const updatedInterviews = interviews.map(interview => {
      if (interview.id === selectedInterview.id) {
        return { ...interview, status: 'completed' };
      }
      return interview;
    });
    
    setInterviews(updatedInterviews);
    const completedInterview = updatedInterviews.find(i => i.id === selectedInterview.id);
    
    // Add to completed interviews with timestamp
    const interviewToSave = {
      ...completedInterview,
      completedAt: new Date().toISOString(),
      savedAt: new Date().toISOString()
    };
    
    setCompletedInterviews([...completedInterviews, interviewToSave]);
    
    // Sync to GoHighLevel
    try {
      await syncToGoHighLevel(completedInterview);
      setSelectedInterview(null);
      alert('Interview completed, saved locally, and synced to GoHighLevel!');
    } catch (error) {
      setSelectedInterview(null);
      alert('Interview completed and saved locally, but sync to GoHighLevel failed. Check console for details.');
    }
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedInterviews = completedInterviews.filter(interview =>
    interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-900">Main Line Benefits</h1>
            <p className="text-blue-600 mt-2">Agent Interview System</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
            
            <button
              onClick={() => {
                console.log('Button clicked!');
                console.log('Current form state:', loginForm);
                const user = users[loginForm.username];
                if (user && user.password === loginForm.password) {
                  console.log('Login successful, setting user...');
                  setCurrentUser({ ...user, username: loginForm.username });
                  setLoginForm({ username: '', password: '' });
                } else {
                  console.log('Login failed - user:', user, 'password match:', user?.password === loginForm.password);
                  alert('Invalid credentials');
                }
              }}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all font-medium"
            >
              Sign In
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Demo Accounts:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Recruiter:</strong> recruiter1 / pass123</div>
              <div><strong>Sales Manager:</strong> sales1 / pass123</div>
              <div><strong>Admin:</strong> admin1 / admin123</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 200 200" className="mr-3 drop-shadow-sm">
                {/* Outer blue circle */}
                <path
                  d="M 100 20 A 80 80 0 1 1 45 145 A 80 80 0 0 1 100 20"
                  fill="#004785"
                  stroke="none"
                />
                {/* Inner white circle */}
                <circle cx="100" cy="100" r="60" fill="white" />
                {/* Blue checkmark */}
                <path
                  d="M 75 100 L 90 115 L 130 75"
                  stroke="#009FDA"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Blue dot */}
                <circle cx="100" cy="85" r="6" fill="#009FDA" />
              </svg>
              <h1 className="text-xl font-semibold text-blue-900">Main Line Benefits</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentUser.role !== 'admin' && (
                <>
                  <button
                    onClick={() => setShowWebhookSettings(true)}
                    className="flex items-center px-3 py-2 text-sm bg-gradient-to-r from-sky-100 to-sky-200 text-sky-700 rounded-lg hover:from-sky-200 hover:to-sky-300 transition-all"
                  >
                    🔗 Webhook Settings
                  </button>
                  <button
                    onClick={() => setShowApiSettings(true)}
                    className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ⚙️ API Settings
                  </button>
                  <button
                    onClick={() => setShowNewCandidateModal(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all"
                  >
                    <User className="h-4 w-4 mr-2" />
                    New Candidate
                  </button>
                </>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{currentUser.name} ({currentUser.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {currentUser.role !== 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'questions'
                    ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Interview Questions
              </button>
              <button
                onClick={() => setActiveTab('interviews')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'interviews'
                    ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                My Interviews
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'completed'
                    ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                <Archive className="h-4 w-4 inline mr-2" />
                Completed Interviews ({completedInterviews.length})
              </button>
            </>
          )}
          {currentUser.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                All Interviews & Responses
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'completed'
                    ? 'bg-gradient-to-r from-sky-100 to-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                <Archive className="h-4 w-4 inline mr-2" />
                All Completed ({completedInterviews.length})
              </button>
            </>
          )}
        </div>

        {/* Interview Questions Tab */}
        {activeTab === 'questions' && currentUser.role !== 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Interview Questions</h2>
              <p className="text-gray-600 mb-6">Use these standardized questions to ensure consistency across all agent interviews and evaluate candidates against Main Line Benefits' core values.</p>
              
              {Object.entries(interviewQuestions).map(([category, questions]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Interviews Tab */}
        {activeTab === 'interviews' && currentUser.role !== 'admin' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Interview List or Detail View */}
            {!selectedInterview ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">My Agent Interviews</h2>
                  <div className="space-y-4">
                    {filteredInterviews
                      .filter(interview => interview.interviewer === currentUser.name)
                      .map(interview => (
                        <div
                          key={interview.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedInterview(interview)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{interview.candidateName}</h3>
                              <p className="text-gray-600">{interview.position}</p>
                              <p className="text-sm text-gray-500">{interview.date}</p>
                            </div>
                            <div className="flex items-center">
                              {interview.status === 'completed' && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  Completed
                                </span>
                              )}
                              {interview.status === 'in-progress' && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                  In Progress
                                </span>
                              )}
                              {interview.status === 'scheduled' && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  Scheduled
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              // Interview Detail View
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedInterview.candidateName}</h2>
                      <p className="text-gray-600">{selectedInterview.position} - {selectedInterview.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedInterview(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Back to List
                      </button>
                      <button
                        onClick={completeInterview}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        disabled={ghlSyncStatus?.status === 'syncing'}
                      >
                        {ghlSyncStatus?.status === 'syncing' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Syncing...
                          </>
                        ) : (
                          'Complete & Save'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* GHL Sync Status */}
                  {ghlSyncStatus && (
                    <div className={`mb-6 p-4 rounded-lg ${
                      ghlSyncStatus.status === 'success' ? 'bg-green-50 border border-green-200' :
                      ghlSyncStatus.status === 'error' ? 'bg-red-50 border border-red-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-center">
                        {ghlSyncStatus.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mr-2" />}
                        {ghlSyncStatus.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600 mr-2" />}
                        {ghlSyncStatus.status === 'syncing' && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>}
                        <span className="font-medium">{ghlSyncStatus.message}</span>
                      </div>
                      {ghlSyncStatus.contactId && (
                        <p className="text-sm text-gray-600 mt-1">Contact ID: {ghlSyncStatus.contactId}</p>
                      )}
                    </div>
                  )}

                  {Object.entries(interviewQuestions).map(([category, questions]) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <p className="text-gray-800 mb-3">{question}</p>
                            {/* Use multiple choice for Core Values questions only */}
                            {(category.includes('Core Value')) ? (
                              <div className="flex space-x-4">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`${category}-${index}`}
                                    value="+"
                                    checked={selectedInterview.responses[category]?.[question] === '+'}
                                    onChange={(e) => saveResponse(category, question, e.target.value)}
                                    className="mr-2"
                                  />
                                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    + Excellent
                                  </span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`${category}-${index}`}
                                    value="+/-"
                                    checked={selectedInterview.responses[category]?.[question] === '+/-'}
                                    onChange={(e) => saveResponse(category, question, e.target.value)}
                                    className="mr-2"
                                  />
                                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                    +/- Average
                                  </span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`${category}-${index}`}
                                    value="-"
                                    checked={selectedInterview.responses[category]?.[question] === '-'}
                                    onChange={(e) => saveResponse(category, question, e.target.value)}
                                    className="mr-2"
                                  />
                                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                    - Poor
                                  </span>
                                </label>
                              </div>
                            ) : (
                              /* Use text area for Culture & Background and Closing Questions */
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows="3"
                                placeholder="Enter candidate's response..."
                                value={selectedInterview.responses[category]?.[question] || ''}
                                onChange={(e) => saveResponse(category, question, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed Interviews Tab */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search completed interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Completed Interview List or Detail View */}
            {!viewingCompletedInterview ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentUser.role === 'admin' ? 'All Completed Interviews' : 'My Completed Interviews'}
                  </h2>
                  {filteredCompletedInterviews.length === 0 ? (
                    <p className="text-gray-500">No completed interviews found.</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredCompletedInterviews
                        .filter(interview => currentUser.role === 'admin' || interview.interviewer === currentUser.name)
                        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                        .map(interview => (
                          <div
                            key={interview.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{interview.candidateName}</h3>
                                <p className="text-gray-600">{interview.position}</p>
                                <p className="text-sm text-gray-500">
                                  Interviewed by {interview.interviewer} on {interview.date}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Completed: {new Date(interview.completedAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setViewingCompletedInterview(interview)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="View Interview"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => generatePDF(interview)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Download PDF"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                {currentUser.role === 'admin' && (
                                  <button
                                    onClick={() => deleteCompletedInterview(interview.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Delete Interview"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Viewing Completed Interview Detail
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{viewingCompletedInterview.candidateName}</h2>
                      <p className="text-gray-600">{viewingCompletedInterview.position} - {viewingCompletedInterview.date}</p>
                      <p className="text-sm text-gray-500">Interviewer: {viewingCompletedInterview.interviewer}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingCompletedInterview(null)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Back to List
                      </button>
                      <button
                        onClick={() => generatePDF(viewingCompletedInterview)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">{viewingCompletedInterview.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{viewingCompletedInterview.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Interview Responses */}
                  {Object.entries(viewingCompletedInterview.responses).map(([category, categoryResponses]) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                      <div className="space-y-4">
                        {Object.entries(categoryResponses).map(([question, answer], index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <p className="text-gray-800 font-medium mb-2">{question}</p>
                            {/* Show scoring for Core Values questions, text for others */}
                            {(category.includes('Core Value') && (answer === '+' || answer === '+/-' || answer === '-')) ? (
                              <div className="flex items-center">
                                {answer === '+' && (
                                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    + Excellent
                                  </span>
                                )}
                                {answer === '+/-' && (
                                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                    +/- Average
                                  </span>
                                )}
                                {answer === '-' && (
                                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                    - Poor
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Notes */}
                  {viewingCompletedInterview.notes && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Interview Notes</h3>
                      <p className="text-blue-800">{viewingCompletedInterview.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Agent Interview Responses</h2>
              <p className="text-gray-600 mb-6">Monitor interview consistency and review all agent candidate responses.</p>
              
              <div className="space-y-6">
                {filteredInterviews.map(interview => (
                  <div key={interview.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{interview.candidateName}</h3>
                        <p className="text-gray-600">{interview.position}</p>
                        <p className="text-sm text-gray-500">Interviewer: {interview.interviewer} | Date: {interview.date}</p>
                      </div>
                      <div className="flex items-center">
                        {interview.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {interview.status === 'in-progress' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                        {interview.status === 'scheduled' && <Calendar className="h-5 w-5 text-blue-500" />}
                        <span className="ml-2 text-sm capitalize">{interview.status}</span>
                      </div>
                    </div>

                    {Object.keys(interview.responses).length > 0 && (
                      <div className="space-y-4">
                        {Object.entries(interview.responses).map(([category, categoryResponses]) => (
                          <div key={category}>
                            <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                            <div className="space-y-2">
                              {Object.entries(categoryResponses).map(([question, answer], index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-700 mb-2"><strong>Q:</strong> {question}</p>
                                  {/* Show scoring for Core Values questions, text for others */}
                                  {(category.includes('Core Value') && (answer === '+' || answer === '+/-' || answer === '-')) ? (
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-600 mr-2"><strong>Score:</strong></span>
                                      {answer === '+' && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                          + Excellent
                                        </span>
                                      )}
                                      {answer === '+/-' && (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                          +/- Average
                                        </span>
                                      )}
                                      {answer === '-' && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                          - Poor
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-600"><strong>Response:</strong> {answer}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {Object.keys(interview.responses).length === 0 && (
                      <p className="text-gray-500 italic">No responses recorded yet.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Candidate Modal */}
      {showNewCandidateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add New Candidate</h2>
                <button
                  onClick={() => setShowNewCandidateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidate Name *
                    </label>
                    <input
                      type="text"
                      value={newCandidateForm.candidateName}
                      onChange={(e) => setNewCandidateForm({...newCandidateForm, candidateName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter candidate's full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      value={newCandidateForm.position}
                      onChange={(e) => setNewCandidateForm({...newCandidateForm, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Insurance Agent">Insurance Agent</option>
                      <option value="Sub-Agent">Sub-Agent</option>
                      <option value="Assistant">Assistant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newCandidateForm.email}
                      onChange={(e) => setNewCandidateForm({...newCandidateForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="candidate@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newCandidateForm.phone}
                      onChange={(e) => setNewCandidateForm({...newCandidateForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    value={newCandidateForm.interviewDate}
                    onChange={(e) => setNewCandidateForm({...newCandidateForm, interviewDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank to use today's date</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Notes (Optional)
                  </label>
                  <textarea
                    value={newCandidateForm.notes}
                    onChange={(e) => setNewCandidateForm({...newCandidateForm, notes: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Any initial notes about the candidate..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowNewCandidateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewCandidate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Settings Modal */}
      {showWebhookSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-900">GoHighLevel Webhook Settings</h2>
                <button
                  onClick={() => setShowWebhookSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      <strong>Direct GoHighLevel Webhook:</strong> Best integration method!
                    </p>
                  </div>
                </div>

                {/* Webhook URL input - moved up for easier access */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GoHighLevel Webhook URL
                  </label>
                  <input
                    type="url"
                    value={apiSettings.webhookUrl}
                    onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                    placeholder="https://services.leadconnectorhq.com/hooks/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste your GoHighLevel webhook URL here
                  </p>
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <div className="flex items-center">
                    {apiSettings.webhookUrl && apiSettings.webhookUrl.trim() !== '' ? (
                      <>
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-green-700">Configured ✓</span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-red-700">Not Configured</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Test webhook section */}
                {apiSettings.webhookUrl && apiSettings.webhookUrl.trim() !== '' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-yellow-900">🧪 Test Your Webhook</h4>
                        <p className="text-sm text-yellow-800 mt-1">
                          Send a test request to verify your webhook is working properly.
                        </p>
                      </div>
                      <button
                        onClick={testWebhook}
                        disabled={webhookTestStatus?.status === 'testing'}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center"
                      >
                        {webhookTestStatus?.status === 'testing' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Testing...
                          </>
                        ) : (
                          <>
                            🚀 Test Webhook
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Test status */}
                    {webhookTestStatus && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        webhookTestStatus.status === 'success' ? 'bg-green-100 border border-green-200' :
                        webhookTestStatus.status === 'error' ? 'bg-red-100 border border-red-200' :
                        'bg-blue-100 border border-blue-200'
                      }`}>
                        <div className="flex items-center">
                          {webhookTestStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                          {webhookTestStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600 mr-2" />}
                          {webhookTestStatus.status === 'testing' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>}
                          <span className="text-sm font-medium">{webhookTestStatus.message}</span>
                        </div>
                        {webhookTestStatus.details && (
                          <p className="text-xs mt-2 font-mono bg-white p-2 rounded border">
                            {webhookTestStatus.details}
                          </p>
                        )}
                        
                        {/* Show alternative testing methods if CORS error */}
                        {webhookTestStatus.status === 'error' && webhookTestStatus.message.includes('Network error') && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <h5 className="font-medium text-blue-900 text-sm mb-2">✅ This is normal! Try these alternatives:</h5>
                            <div className="space-y-3 text-sm">
                              <div>
                                <strong className="text-blue-800">Option 1: Test with curl</strong>
                                <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
{`curl -X POST "${apiSettings.webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"candidateName":"Test","email":"test@example.com","isTest":true}'`}
                                </pre>
                              </div>
                              <div>
                                <strong className="text-blue-800">Option 2: Test with real interview</strong>
                                <p className="text-blue-700">Complete an actual interview in the dashboard - that will work even with CORS restrictions!</p>
                              </div>
                              <div>
                                <strong className="text-blue-800">Option 3: Check GoHighLevel</strong>
                                <p className="text-blue-700">Look for any test requests that might have gotten through despite the browser error.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsible setup instructions */}
                <details className="bg-blue-50 border border-blue-200 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-blue-900">
                    📋 Setup Instructions (click to expand)
                  </summary>
                  <div className="px-4 pb-4">
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Login to <strong>GoHighLevel</strong></li>
                      <li>Go to <strong>Settings → Integrations → Webhooks</strong></li>
                      <li>Click <strong>"Add Webhook"</strong></li>
                      <li>Set Method: <strong>POST</strong>, Content Type: <strong>application/json</strong></li>
                      <li><strong>Copy webhook URL</strong> and paste above</li>
                    </ol>
                  </div>
                </details>

                {/* Collapsible sample data */}
                <details className="bg-gray-50 border border-gray-200 rounded-lg">
                  <summary className="p-4 cursor-pointer font-medium text-gray-900">
                    📊 Sample Webhook Data (click to expand)
                  </summary>
                  <div className="px-4 pb-4">
                    <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
{`{
  "candidateName": "Sarah Thompson",
  "email": "sarah@email.com",
  "phone": "+1-555-0123",
  "position": "Insurance Agent",
  "tags": ["Agent-Candidate"],
  "coreValues": {
    "team_player": {"score": "+"}
  }
}`}
                    </pre>
                  </div>
                </details>
              </div>

              {/* Fixed save buttons at bottom */}
              <div className="sticky bottom-0 bg-white border-t pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowWebhookSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowWebhookSettings(false);
                    setGhlSyncStatus(null);
                    setWebhookTestStatus(null);
                    alert('Webhook settings saved! You can now test the integration.');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Webhook Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Settings Modal */}
      {showApiSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">GoHighLevel API Settings</h2>
                <button
                  onClick={() => setShowApiSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      <strong>Webhook Integration:</strong> More reliable than direct API calls!
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Integration Method
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={apiSettings.useWebhook}
                        onChange={(e) => setApiSettings({...apiSettings, useWebhook: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Use Webhook (Recommended)</span>
                    </label>
                  </div>
                </div>

                {apiSettings.useWebhook ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL (Zapier, Make.com, or custom endpoint)
                    </label>
                    <input
                      type="url"
                      value={apiSettings.webhookUrl}
                      onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                      placeholder="https://hooks.zapier.com/hooks/catch/your-webhook-url"
                    />
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Go to <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="underline">Zapier.com</a> (or Make.com)</li>
                        <li>Create new Zap: Webhook → GoHighLevel</li>
                        <li>Copy the webhook URL and paste above</li>
                        <li>Configure Zapier to create GHL contact with the webhook data</li>
                        <li>Test the integration!</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GoHighLevel API Key
                      </label>
                      <textarea
                        value={apiSettings.apiKey}
                        onChange={(e) => setApiSettings({...apiSettings, apiKey: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-xs"
                        rows="3"
                        placeholder="Paste your API key here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location ID
                      </label>
                      <input
                        type="text"
                        value={apiSettings.locationId}
                        onChange={(e) => setApiSettings({...apiSettings, locationId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                        placeholder="Your GHL Location ID"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowApiSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowApiSettings(false);
                    setGhlSyncStatus(null);
                    alert('API settings updated! Try syncing again.');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentDashboard;