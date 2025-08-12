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
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Email is required'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
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
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Prepare row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.email,
      data.name || '',
      data.company || '',
      data.useCase || '',
      data.source || 'Unknown',
      e.parameter.userIp || 'Unknown',
      e.parameter.userAgent || 'Unknown'
    ];
    
    // Check for duplicate emails
    const emailColumn = 2; // Email is in column B (index 2)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) { // Start from 1 to skip headers
      if (values[i][emailColumn - 1] === data.email) {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            error: 'Email already registered'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add the new row
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);
    
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
  const testData = {
    email: 'test@example.com',
    name: 'Test User',
    company: 'Test Company',
    useCase: 'startup',
    timestamp: new Date().toISOString(),
    source: 'Test'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    },
    parameter: {
      userIp: '127.0.0.1',
      userAgent: 'Test Agent'
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
