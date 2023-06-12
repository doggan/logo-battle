import { NextApiResponse, NextApiRequest } from 'next';
import clientPromise from '@/utils/mongodb';

export default async function handler(
  _req: NextApiRequest,
  // res: NextApiResponse<Person[]>
  res: NextApiResponse,
) {
  const client = await clientPromise;
  const db = client.db('test');
  const companies = db.collection('companies');

  // TODO: not paginated
  // TODO: sort by create at...

  const companyResults = await companies.find({}).toArray();

  res.status(200).json(companyResults);
}
