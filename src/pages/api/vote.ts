import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
// import Vote from '@/models/vote';
// import Company from '@/models/company';
// import mongoose from 'mongoose';

export type Error = {
  error: string;
};

type Vote = {
  voteForCompanyId: string;
  voteAgainstCompanyId: string;
  // createdAt: { type: Date, default: Date.now },
};

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

export default async function handler(
  req: NextApiRequest,
  // res: NextApiResponse<Vote | Error>,
  // TODO: type safety??
  res: NextApiResponse,
) {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(422).send({ error: 'Invalid request: expected POST.' });
  }

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
