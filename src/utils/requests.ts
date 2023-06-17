import { Company, Result } from '@/utils/models';

export type ErrorResponse = {
  error: string;
};

export type GetBattleResponse = {
  company1: Company;
  company2: Company;
};

export type GetCompanyResponse = {
  company: Company;
};

export type GetCompaniesResponse = {
  companies: Company[];
};

export enum CompanySortBy {
  WinPercentageDesc = 'WinPercentageDesc',
}

export type GetResultsResponse = {
  results: Result[];
};
