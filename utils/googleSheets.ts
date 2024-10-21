import { google, sheets_v4 } from 'googleapis';
//const config = require('../../Website/config/config.json');
// Define types for environment variables
const privateKey: string = process.env.private_key || '';
const clientEmail: string = process.env.client_email || '';
const spreadsheetId: string = process.env.google_sheet_Id || '';
// Set up JWT authentication
const auth = new google.auth.JWT(
  clientEmail,
  undefined,
  privateKey.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
);
// Set up Google Sheets API client
const sheets: sheets_v4.Sheets = google.sheets({ version: 'v4', auth });
// Type for the response data from the Sheets API
type SheetData = (string | number)[][];
export const googleSheetsAPI = {
  // Function to retrieve data from the Google Sheet
  async getSheetData(): Promise<SheetData> {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:D10', // Adjust the range as needed
      });
      return response.data.values || [];
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw new Error('Unable to retrieve data');
    }
  },
};
// Export appendRow function directly
export const appendRow = async (data: (string | number)[]): Promise<sheets_v4.Schema$AppendValuesResponse> => {
  try {
    console.log(data);
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:D', // Adjust the range as needed
      valueInputOption: 'USER_ENTERED', // How the input data should be interpreted
      requestBody: {
        values: [data], // The new row data, e.g., ['Name', 'Email', 'Date', 'Message']
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error appending data:', error);
    throw new Error('Unable to append data');
  }
};