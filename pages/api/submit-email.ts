import { NextApiRequest, NextApiResponse } from "next";
import { insertEmail } from "../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email } = req.body;
    try {
      await insertEmail(email);
      res.status(200).json({ message: "Email added to the waitlist!" });
    } catch (error) {
      console.error("Error inserting email into database:", error);
      res.status(500).json({ message: "An error occurred. Please try again later." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};