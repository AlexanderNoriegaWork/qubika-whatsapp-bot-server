import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  return res.json(uuidv4());
}
