import { Document } from 'mongodb';

export type Company = {
  id: string;
  name: string;
  imageName: string;
  wins: number;
  losses: number;
};

export function toCompany(document: Document): Company {
  return {
    id: document._id,
    name: document.name,
    imageName: document.imageName,
    wins: document.wins,
    losses: document.losses,
  };
}

export type Result = {
  id: string;
  companyId1: string;
  companyId2: string;
  didVoteForCompany1: boolean;
  createdAt: Date;
};

export function toResult(document: Document): Result {
  return {
    id: document._id,
    companyId1: document.companyId1,
    companyId2: document.companyId2,
    didVoteForCompany1: document.didVoteForCompany1,
    createdAt: document.createdAt,
  };
}
