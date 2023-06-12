import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

function getBattle(req: NextApiRequest, res: NextApiResponse) {
  // TODO:randomly get 2 companies from the DB (different ones) and return them
  // https://stackoverflow.com/questions/2824157/how-can-i-get-a-random-record-from-mongodb

  console.log('### get battle return');
  res.status(200).json({
    company1: {
      id: '6484bfe2053e1512c97c1cf8',
      name: 'Apple Inc',
      imageName: 'apple.png',
      symbol: 'AAPL',
    },
    company2: {
      id: '6484bfe2053e1512c97c1cf9',
      name: 'Microsoft Corp',
      imageName: 'microsoft.png',
      symbol: 'MSFT',
    },
  });
}

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

async function postBattle(req: NextApiRequest, res: NextApiResponse) {
  const voteForCompanyId = getId(req, 'voteForCompanyId');
  if (!voteForCompanyId) {
    return res
      .status(400)
      .send({ error: `Missing or invalid param: voteForCompanyId` });
  }
  const voteAgainstCompanyId = getId(req, 'voteAgainstCompanyId');
  if (!voteAgainstCompanyId) {
    return res
      .status(400)
      .send({ error: `Missing or invalid param: voteAgainstCompanyId` });
  }

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db('test');
  const companies = db.collection('companies');

  // Verify the companies exist.
  const companyVoteFor = await companies.findOne({
    _id: voteForCompanyId,
  });
  if (!companyVoteFor) {
    return res
      .status(400)
      .send({ error: 'Company not found: ' + voteForCompanyId });
  }
  const companyVoteAgainst = await companies.findOne({
    _id: voteAgainstCompanyId,
  });
  if (!companyVoteAgainst) {
    return res
      .status(400)
      .send({ error: 'Company not found: ' + companyVoteAgainst });
  }

  // TODO: add a new vote row
  // Update the companies

  const votes = db.collection('votes');
  const insertResult = await votes.insertOne({
    voteForCompanyId: voteForCompanyId,
    voteAgainstCompanyId,
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

  if (method === 'GET') {
    return getBattle(req, res);
  } else if (method === 'POST') {
    return postBattle(req, res);
  } else {
    return res
      .status(422)
      .send({ error: 'Invalid request: expected GET or POST.' });
  }
}
