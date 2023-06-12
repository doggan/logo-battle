import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { Document } from 'mongodb';

type Company = {
  id: string;
  name: string;
  imageName: string;
  wins: number;
  losses: number;
};

type ResponseData = {
  company1: Company;
  company2: Company;
};

type Error = {
  error: string;
};

function toCompany(document: Document): Company {
  return {
    id: document._id,
    name: document.name,
    imageName: document.imageName,
    wins: document.wins,
    losses: document.losses,
  };
}

export async function GET(
  _req: Request,
): Promise<NextResponse<ResponseData | Error>> {
  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const companies = db.collection('companies');

  const cursor = companies.aggregate([{ $sample: { size: 2 } }]);
  const results = await cursor.toArray();

  if (results.length < 2) {
    return NextResponse.json(
      {
        error: 'Not enough companies to choose from.',
      },
      { status: 500 },
    );
  }

  // TODO: confirm whether we're guaranteed to ge unique results from 'aggregate', or if we need to retry
  // if we encounter dupes.

  return NextResponse.json(
    {
      company1: toCompany(results[0]),
      company2: toCompany(results[1]),
    },
    { status: 200 },
  );
}
