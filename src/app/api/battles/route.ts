import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { toCompany } from '@/utils/models';
import { ErrorResponse, GetBattleResponse } from '@/utils/requests';

/**
 * Force the route to avoid the cache and always dynamically render.
 * Without this, this route will be cached on Edge network and new
 * battle results will not be returned.
 */
export const revalidate = 0;

export async function GET(
  _req: Request,
): Promise<NextResponse<GetBattleResponse | ErrorResponse>> {
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
