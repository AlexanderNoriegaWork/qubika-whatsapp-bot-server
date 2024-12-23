import { VercelRequest, VercelResponse } from "@vercel/node";
import { postDocument } from "../lib/mavenagi";

const LOG_CTX = "[knowledge]";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  try {
    // Extract file from request body
    const file = req.body;

    if (!file) {
      return res
        .status(400)
        .json({ message: "No file provided in the request." });
    }

    // Log some information about the file
    console.log(
      `${LOG_CTX} Received file of size:`,
      Buffer.byteLength(file, "utf-8"),
      "bytes",
    );

    const response = await postDocument(file);

    console.log(`${LOG_CTX} Document sent`, JSON.stringify(response));

    return res.status(200).json({
      message: "File successfully processed and sent to third-party API.",
      thirdPartyResponse: response.data,
    });
  } catch (error: any) {
    console.error(`${LOG_CTX} Error processing file:`, error.message);

    return res.status(500).json({
      message: "An error occurred while processing the file.",
      error: error.message,
    });
  }
}
