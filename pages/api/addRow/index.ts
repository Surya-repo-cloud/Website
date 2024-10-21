import { NextApiRequest, NextApiResponse } from 'next';
import { appendRow } from '../../../utils/googleSheets';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Expect data from the request body
      const { aboutProject,budget,company, email,fName,lName,hearAboutUs ,mobile,pricingPlan,role,timeline}: { aboutProject: string; budget:string;company:string; email: string;fName:string;lName:string;hearAboutUs: string;mobile:number;pricingPlan:string;role:string;timeline:string } = req.body;
      // Prepare the new row data based on the Google Sheets structure
      const newRow = [aboutProject,budget,company, email,fName, lName,hearAboutUs,mobile,pricingPlan,role,timeline];
      // Append the new row to Google Sheets
      const result = await appendRow(newRow);
      // Respond with success
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      console.error('Error appending data:', error);
      // Respond with error
      res.status(500).json({ status: 'error', message: 'Error appending data to Google Sheets' });
    }
  } else {
    // Method not allowed for non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  // In case of an unhandled situation, we explicitly end the request
  if (!res.writableEnded) {
    res.end();
  }
}