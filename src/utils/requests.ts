import { Company, Result } from '@/utils/models';

export type CompaniesResponseData = {
  companies: Company[];
};

export enum CompanySortBy {
  WinPercentageDesc = 'WinPercentageDesc',
}

export type ResultsResponseData = {
  results: Result[];
};
