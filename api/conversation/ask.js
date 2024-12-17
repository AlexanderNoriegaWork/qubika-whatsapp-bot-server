import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("received a question");
    return res.json(uuidv4());
  } else {
    return res.json(uuidv4());
  }
}
