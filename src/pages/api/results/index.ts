import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

// TODO: cleanup
function getId(req: NextApiRequest, paramName: string): ObjectId | null {
  const paramStr = req.body[paramName];

  if (!paramStr) {
    return null;
  }

  try {
    return new ObjectId(paramStr);
  } catch (e) {
    return null;
  }
}

async function postResult(req: NextApiRequest, res: NextApiResponse) {
  const companyId1 = getId(req, 'companyId1');
  if (!companyId1) {
    return res
      .status(400)
      .send({ error: `Missing or invalid param: companyId1` });
  }
  const companyId2 = getId(req, 'companyId2');
  if (!companyId2) {
    return res
      .status(400)
      .send({ error: `Missing or invalid param: companyId2` });
  }

  const { didVoteForCompany1 } = req.body;

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db('test');
  const companies = db.collection('companies');

  // Verify the companies exist.
  const company1 = await companies.findOne({
    _id: companyId1,
  });
  if (!company1) {
    return res.status(400).send({ error: 'Company not found: ' + companyId1 });
  }
  const company2 = await companies.findOne({
    _id: companyId2,
  });
  if (!company2) {
    return res.status(400).send({ error: 'Company not found: ' + companyId2 });
  }

  // TODO: add a new vote row
  // Update the companies

  const votes = db.collection('votes');
  const insertResult = await votes.insertOne({
    companyId1,
    companyId2,
    didVoteForCompany1,
  });

  const newVote = await votes.findOne({ _id: insertResult.insertedId });

  console.log('### new vote: ', newVote);
  res.status(200).json(newVote);
}

export default async function handler(
  req: NextApiRequest,
  // res: NextApiResponse<Vote | Error>,
  // TODO: type safety??
  res: NextApiResponse,
) {
  const { method } = req;

  if (method === 'POST') {
    return postResult(req, res);
  } else {
    return res.status(422).send({ error: 'Invalid request: expected POST.' });
  }
}
