/**
 * Google Apps Script for ServerlessKit Waitlist Form
 * 
 * This script handles form submissions from the ServerlessKit landing page
 * and saves them to the specified Google Sheets document.
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SPREADSHEET_ID with your Google Sheets ID
 * 5. Deploy as a web app with execute permissions for "Anyone"
 * 6. Copy the web app URL and update it in index.html
 */

// Configuration
const SPREADSHEET_ID = '1QVv649pyPqJFEujihbTffreUPW2sX6HEn7HjShWu8I0';
const SHEET_NAME = 'Waitlist Signups';

/**
 * Handle POST requests from the waitlist form
 */
function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received POST request:', e);
    console.log('Post data type:', e.postData ? e.postData.type : 'No postData');
    console.log('Parameters:', e.parameter);

    let data;

    // Handle both JSON and FormData submissions
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
      console.log('Parsed JSON data:', data);
    } else {
      // Handle FormData (most common from web forms)
      data = {
        email: e.parameter.email || '',
        name: e.parameter.name || '',
        company: e.parameter.company || '',
        useCase: e.parameter.useCase || '',
        timestamp: e.parameter.timestamp || new Date().toISOString(),
        source: e.parameter.source || 'ServerlessKit Landing Page'
      };
      console.log('Parsed FormData:', data);
    }

    // Validate required fields
    if (!data.email || data.email.trim() === '') {
      console.log('Validation failed: No email provided');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Email is required'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.log('Validation failed: Invalid email format');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the spreadsheet
    console.log('Attempting to open spreadsheet with ID:', SPREADSHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet opened successfully');

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    console.log('Looking for sheet:', SHEET_NAME);

    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log('Sheet not found, creating new sheet:', SHEET_NAME);
      sheet = spreadsheet.insertSheet(SHEET_NAME);

      // Add headers
      const headers = [
        'Timestamp',
        'Email',
        'Name',
        'Company',
        'Use Case',
        'Source',
        'IP Address',
        'User Agent'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('Headers added to new sheet');

      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      console.log('Header formatting applied');
    } else {
      console.log('Sheet found:', sheet.getName());
    }
    
    // Prepare row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.email,
      data.name || '',
      data.company || '',
      data.useCase || '',
      data.source || 'Unknown',
      'N/A', // IP Address (not available in current setup)
      'N/A'  // User Agent (not available in current setup)
    ];

    console.log('Prepared row data:', rowData);

    // Check for duplicate emails (optional - can be disabled for testing)
    const emailColumn = 2; // Email is in column B (index 2)
    try {
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      console.log('Checking for duplicates in', values.length, 'rows');

      for (let i = 1; i < values.length; i++) { // Start from 1 to skip headers
        if (values[i][emailColumn - 1] === data.email) {
          console.log('Duplicate email found:', data.email);
          return ContentService
            .createTextOutput(JSON.stringify({
              success: false,
              error: 'Email already registered'
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    } catch (duplicateCheckError) {
      console.log('Error checking duplicates (continuing anyway):', duplicateCheckError);
    }

    // Add the new row
    console.log('Adding new row to sheet');
    sheet.appendRow(rowData);
    console.log('Row added successfully');

    // Auto-resize columns for better readability
    try {
      sheet.autoResizeColumns(1, rowData.length);
      console.log('Columns auto-resized');
    } catch (resizeError) {
      console.log('Error resizing columns (non-critical):', resizeError);
    }
    
    // Send confirmation email (optional)
    try {
      sendConfirmationEmail(data.email, data.name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the whole request if email fails
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Successfully added to waitlist'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ServerlessKit Waitlist API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send confirmation email to new signups
 */
function sendConfirmationEmail(email, name) {
  const subject = '🚀 Welcome to the ServerlessKit Waitlist!';
  const displayName = name ? name : 'there';
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #FF9900 0%, #232F3E 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ServerlessKit!</h1>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #232F3E;">Hi ${displayName}! 👋</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Thanks for joining the ServerlessKit waitlist! You're now part of an exclusive group of developers who will get early access to the complete AWS-powered SaaS foundation.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9900;">
          <h3 style="margin-top: 0; color: #232F3E;">What happens next?</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>🎯 We'll notify you as soon as early access opens</li>
            <li>💰 You'll get 3 months free on any plan</li>
            <li>🏗️ Dedicated AWS architecture support during setup</li>
            <li>📚 Exclusive access to our deployment guides and best practices</li>
          </ul>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          In the meantime, follow us on <a href="https://x.com/serverlesskit1" style="color: #FF9900;">Twitter</a> for updates and serverless tips!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://serverlesskit.com" style="background: #FF9900; color: #232F3E; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit ServerlessKit</a>
        </div>
      </div>
      
      <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>ServerlessKit - From Zero to SaaS in Minutes</p>
        <p>AWS-Native • Multi-Tenant • Production-Ready</p>
      </div>
    </div>
  `;
  
  const textBody = `
Hi ${displayName}!

Thanks for joining the ServerlessKit waitlist! You're now part of an exclusive group of developers who will get early access to the complete AWS-powered SaaS foundation.

What happens next?
• We'll notify you as soon as early access opens
• You'll get 3 months free on any plan  
• Dedicated AWS architecture support during setup
• Exclusive access to our deployment guides and best practices

In the meantime, follow us on Twitter (@serverlesskit1) for updates and serverless tips!

Visit us: https://serverlesskit.com

---
ServerlessKit - From Zero to SaaS in Minutes
AWS-Native • Multi-Tenant • Production-Ready
  `;
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    body: textBody
  });
}

/**
 * Test function to verify the script works
 */
function testScript() {
  console.log('Starting test script...');

  const testData = {
    email: 'test@serverlesskit.com',
    name: 'Test User',
    company: 'Test Company',
    useCase: 'startup',
    timestamp: new Date().toISOString(),
    source: 'Test Script'
  };

  const mockEvent = {
    parameter: {
      email: testData.email,
      name: testData.name,
      company: testData.company,
      useCase: testData.useCase,
      timestamp: testData.timestamp,
      source: testData.source
    }
  };

  console.log('Mock event:', mockEvent);

  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());

  return result.getContent();
}

/**
 * Simple test to check if we can access the spreadsheet
 */
function testSpreadsheetAccess() {
  try {
    console.log('Testing spreadsheet access...');
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('Spreadsheet name:', spreadsheet.getName());

    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.log('Sheet not found, creating it...');
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    console.log('Sheet name:', sheet.getName());
    console.log('Sheet has', sheet.getLastRow(), 'rows');

    return 'Spreadsheet access successful';
  } catch (error) {
    console.error('Spreadsheet access failed:', error);
    return 'Spreadsheet access failed: ' + error.toString();
  }
}
