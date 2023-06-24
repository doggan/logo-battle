import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { toCompany } from '@/utils/models';
import { ObjectId } from 'mongodb';
import {
  CompanySortBy,
  ErrorResponse,
  GetCompaniesResponse,
} from '@/utils/requests';
import { clamp } from '@/utils/math';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 20;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetCompaniesResponse | ErrorResponse>> {
  // TODO:
  // - paginate (limit, offset)... if we sort in code, we need to handle this.
  //    if we want to do it on the db layer, we'll need to store win % in the document.
  // - take a sort parameter (win %)

  // const limit = searchParams.has('limit')
  //   ? clamp(searchParams.get('limit'), 1, 20)
  //   : 20;
  //
  // console.log(searchParams.has('limit'));
  // console.log(searchParams.get('limit'));

  const { searchParams } = new URL(req.url);

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

  let companyIds: string[] = [];
  if (searchParams.has('ids')) {
    const companyIdsParam = searchParams.get('ids');
    if (companyIdsParam) {
      companyIds = companyIdsParam.split(',');
    }
  }

  let sortBy: CompanySortBy | undefined;
  if (searchParams.has('sortBy')) {
    const sortByParam = searchParams.get('sortBy');
    if (sortByParam) {
      sortBy = (<any>CompanySortBy)[sortByParam];
      if (!sortBy) {
        return NextResponse.json(
          {
            error: 'Invalid sortBy parameter.',
          },
          { status: 400 },
        );
      }
    }
  }

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const companiesCollection = db.collection('companies');

  let filter = {};
  if (companyIds.length > 0) {
    filter = {
      _id: {
        $in: companyIds.map((v) => new ObjectId(v)),
      },
    };
  }

  const cursor = companiesCollection.find(filter).skip(offset).limit(limit);
  const companyDocuments = await cursor.toArray();

  const companies = companyDocuments.map((d) => toCompany(d));

  if (sortBy === CompanySortBy.WinPercentageDesc) {
    companies.sort((x, y) => {
      const xTotalBattles = (x.wins ?? 0) + (x.losses ?? 0);
      const yTotalBattles = (y.wins ?? 0) + (y.losses ?? 0);

      if (xTotalBattles === 0 && yTotalBattles === 0) {
        return 0;
      }
      if (xTotalBattles === 0) {
        return 1;
      }
      if (yTotalBattles === 0) {
        return -1;
      }

      const xWinPercentage = x.wins / xTotalBattles;
      const yWinPercentage = y.wins / yTotalBattles;

      return xWinPercentage > yWinPercentage ? -1 : 1;
    });
  }

  const totalCompaniesCount = await companiesCollection.countDocuments(filter);

  return NextResponse.json(
    {
      companies: companies,
      totalCompaniesCount: totalCompaniesCount,
    },
    { status: 200 },
  );
}
