import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const human = await validateHuman(req);
  if (!human) {
    res.status(400).json({ error: 'You are not a humane.' });
    return;
  }
  res.status(200).json({ message: 'Verified human' })
}

async function validateHuman(req: any): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY_V3;
  var VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body['g-recaptcha-response']}`;
  const response = await fetch(VERIFY_URL, {
    method: 'POST',
  });
  const data = await response.json();
  console.log(data);
  return data.success;
}
