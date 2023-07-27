import { NextResponse } from 'next/server';
import { collections, getClient } from '@/utils/mongodb';
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
  const { db } = await getClient();
  const companiesCollection = collections.companies(db);

  const cursor = companiesCollection.aggregate([{ $sample: { size: 2 } }]);
  const results = await cursor.toArray();

  if (results.length < 2) {
    return NextResponse.json(
      {
        error: 'Not enough companies to choose from.',
      },
      { status: 500 },
    );
  }

  // Retry logic since $sample may return the same document twice.
  const company1 = toCompany(results[0]);
  let company2 = toCompany(results[1]);
  if (company1.id === company2.id) {
    console.log('Retrying company selection for battle...');
    const RETRY_COUNT = 2;
    for (let i = 0; i < RETRY_COUNT; i++) {
      const newCursor = companiesCollection.aggregate([
        { $sample: { size: 1 } },
      ]);
      const newResults = await newCursor.toArray();
      company2 = toCompany(newResults[0]);
      if (company1.id !== company2.id) {
        break;
      }
    }

    if (company1.id === company2.id) {
      console.error(
        'Max retry count exeeded for company selection during battle.',
      );
      return NextResponse.json(
        {
          error: 'Unable to select companies for battle.',
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    {
      company1,
      company2,
    },
    { status: 200 },
  );
}
