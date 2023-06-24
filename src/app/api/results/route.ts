import { ObjectId, SortDirection } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import clientPromise from '@/utils/mongodb';
import { toResult } from '@/utils/models';
import { clamp } from '@/utils/math';
import { ErrorResponse, GetResultsResponse } from '@/utils/requests';

type PostResponseData = Record<string, never>;

function getBodySchema() {
  return z.object({
    companyId1: z.string().min(1),
    companyId2: z.string().min(1),
    didVoteForCompany1: z.boolean(),
  });
}

export async function POST(
  req: Request,
): Promise<NextResponse<PostResponseData | ErrorResponse>> {
  const result = getBodySchema().safeParse(await req.json());
  if (!result.success) {
    const { path, message } = result.error.issues[0];
    return NextResponse.json(
      { error: `[${path}] - ${message}` },
      { status: 400 },
    );
  }

  const { companyId1, companyId2, didVoteForCompany1 } = result.data;

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  // TODO:
  // - should technically be in a transaction since we're dealing with multiple documents
  // - move to some type of service so we don't have to deal with the raw mongo commands here?

  const companies = db.collection('companies');
  const company1IncUpdate = didVoteForCompany1 ? { wins: 1 } : { losses: 1 };
  const company2IncUpdate = !didVoteForCompany1 ? { wins: 1 } : { losses: 1 };

  const company1 = await companies.findOneAndUpdate(
    {
      _id: new ObjectId(companyId1),
    },
    { $inc: company1IncUpdate },
  );
  if (!company1.value) {
    return NextResponse.json(
      { error: 'Company not found: ' + companyId1 },
      { status: 400 },
    );
  }

  const company2 = await companies.findOneAndUpdate(
    {
      _id: new ObjectId(companyId2),
    },
    { $inc: company2IncUpdate },
  );
  if (!company2.value) {
    return NextResponse.json(
      { error: 'Company not found: ' + companyId2 },
      { status: 400 },
    );
  }

  // Insert the new result.
  const results = db.collection('results');
  const insertResult = await results.insertOne({
    companyId1: companyId1,
    companyId2: companyId2,
    didVoteForCompany1: didVoteForCompany1,
    createdAt: new Date(Date.now()),
  });

  if (!insertResult.acknowledged) {
    return NextResponse.json(
      { error: 'Failed to write result.' },
      { status: 500 },
    );
  }

  return NextResponse.json({}, { status: 200 });
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 20;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetResultsResponse | ErrorResponse>> {
  // TODO:
  // - paginate (limit, offset)... if we sort in code, we need to handle this.
  //    if we want to do it on the db layer, we'll need to store win % in the document.
  // - take a sort parameter (win %)

  const { searchParams } = new URL(req.url);

  let companyId: string | null = null;
  if (searchParams.has('companyId')) {
    companyId = searchParams.get('companyId');
  }

  let offset = 0;
  if (searchParams.has('offset')) {
    offset = parseInt(searchParams.get('offset') as string) || offset;
  }
  offset = Math.max(offset, 0);

  let limit = DEFAULT_LIMIT;
  if (searchParams.has('limit')) {
    limit = parseInt(searchParams.get('limit') as string) || limit;
  }
  limit = clamp(limit, 1, MAX_LIMIT);

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const resultsCollection = db.collection('results');

  let filter = {};
  if (companyId) {
    filter = {
      $or: [
        { companyId1: { $eq: companyId } },
        { companyId2: { $eq: companyId } },
      ],
    };
  }

  // Sorting from recent -> oldest.
  const sort = { createdAt: -1 as SortDirection };

  const cursor = resultsCollection
    .find(filter)
    .sort(sort)
    .skip(offset)
    .limit(limit);
  const resultsDocuments = await cursor.toArray();

  const totalResultsCount = await resultsCollection.countDocuments(filter);

  const results = resultsDocuments.map((d) => toResult(d));

  return NextResponse.json(
    {
      results: results,
      totalResultsCount: totalResultsCount,
    },
    { status: 200 },
  );
}
