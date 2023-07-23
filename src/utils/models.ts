import { Document } from 'mongodb';

export type Company = {
  id: string;
  name: string;
  imageName: string;
  // TODO: consider refactoring to a nested RankInfo object
  rank?: number;
  winPercentage: number;
  wins: number;
  losses: number;
};

export function toCompany(document: Document): Company {
  return {
    id: document._id,
    name: document.name,
    imageName: document.imageName,
    winPercentage: document.winPercentage,
    wins: document.wins,
    rank: document.rank ?? undefined,
    losses: document.losses,
  };
}

export type Result = {
  id: string;
  winnerCompanyId: string;
  loserCompanyId: string;
  // If true, the winner company was on the left/top of the display during the battle.
  // This is used to preserve the original battle order of companies when displaying
  // result battles.
  winnerIsFirst: boolean;
  createdAt: Date;
};

export function toResult(document: Document): Result {
  return {
    id: document._id,
    winnerCompanyId: document.winnerCompanyId,
    loserCompanyId: document.loserCompanyId,
    winnerIsFirst: document.winnerIsFirst,
    createdAt: document.createdAt,
  };
}
