import type { NextApiRequest, NextApiResponse } from 'next';
const sendVerifyCode = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'ok' }));
};
export default sendVerifyCode;
