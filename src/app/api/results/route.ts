import { ObjectId, SortDirection } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { collections, getClient } from '@/utils/mongodb';
import { Company, toCompany, toResult } from '@/utils/models';
import { clamp } from '@/utils/math';
import { ErrorResponse, GetResultsResponse } from '@/utils/requests';
import { withTransaction } from '@/utils/transaction';

type PostResponseData = Record<string, never>;

function getBodySchema() {
  return z.object({
    winnerCompanyId: z.string().min(1),
    loserCompanyId: z.string().min(1),
    winnerIsFirst: z.boolean(),
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

  const { winnerCompanyId, loserCompanyId, winnerIsFirst } = result.data;

  const { client, db } = await getClient();
  const companiesCollection = collections.companies(db);
  const resultsCollection = collections.results(db);

  const session = client.startSession();
  try {
    let errorResponse: NextResponse | null = null;

    await withTransaction(session, async () => {
      const winnerCompanyDocument = await companiesCollection.findOne(
        {
          _id: new ObjectId(winnerCompanyId),
        },
        {
          session,
        },
      );
      if (!winnerCompanyDocument) {
        errorResponse = NextResponse.json(
          { error: 'Company not found: ' + winnerCompanyId },
          { status: 400 },
        );
        return false;
      }

      const loserCompanyDocument = await companiesCollection.findOne(
        {
          _id: new ObjectId(loserCompanyId),
        },
        {
          session,
        },
      );
      if (!loserCompanyDocument) {
        errorResponse = NextResponse.json(
          { error: 'Company not found: ' + loserCompanyId },
          { status: 400 },
        );
        return false;
      }

      // Insert the new result.
      const insertResult = await resultsCollection.insertOne(
        {
          winnerCompanyId: winnerCompanyId,
          loserCompanyId: loserCompanyId,
          winnerIsFirst: winnerIsFirst,
          createdAt: new Date(Date.now()),
        },
        {
          session,
        },
      );
      if (!insertResult.acknowledged) {
        errorResponse = NextResponse.json(
          { error: 'Failed to write result.' },
          { status: 500 },
        );
        return false;
      }

      // Update the win/loss counts.
      const winnerCompany = toCompany(winnerCompanyDocument);
      const loserCompany = toCompany(loserCompanyDocument);

      const getUpdateValues = (
        company: Company,
        incrementWins: boolean,
      ): any => {
        const wins = company.wins ?? 0;
        const losses = company.losses ?? 0;
        if (incrementWins) {
          const newWins = wins + 1;
          return {
            wins: newWins,
            winPercentage: newWins / (newWins + losses),
          };
        } else {
          const newLosses = losses + 1;
          return {
            losses: newLosses,
            winPercentage: wins / (wins + newLosses),
          };
        }
      };

      const company1 = await companiesCollection.findOneAndUpdate(
        {
          _id: new ObjectId(winnerCompanyId),
        },
        {
          $set: getUpdateValues(winnerCompany, true),
        },
        {
          session,
        },
      );
      if (!company1.ok) {
        errorResponse = NextResponse.json(
          { error: 'Failed to update winner company.' },
          { status: 500 },
        );
        return false;
      }

      const company2 = await companiesCollection.findOneAndUpdate(
        {
          _id: new ObjectId(loserCompanyId),
        },
        {
          $set: getUpdateValues(loserCompany, false),
        },
        {
          session,
        },
      );
      if (!company2.ok) {
        errorResponse = NextResponse.json(
          { error: 'Failed to update loser company.' },
          { status: 500 },
        );
        return false;
      }

      return true;
    });

    if (errorResponse) {
      return errorResponse;
    }
  } catch (e) {
    console.error('Transaction aborted due to an unexpected error: ' + e);
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  } finally {
    await session.endSession();
  }

  return NextResponse.json({}, { status: 200 });
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetResultsResponse | ErrorResponse>> {
  // TODO:
  // - take a sort parameter (CreatedAtAsc/Desc)

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

  const { db } = await getClient();
  const resultsCollection = collections.results(db);

  let filter = {};
  if (companyId) {
    filter = {
      $or: [
        { winnerCompanyId: { $eq: companyId } },
        { loserCompanyId: { $eq: companyId } },
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
