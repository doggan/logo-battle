import { Company } from '@/utils/models';
import Image from 'next/image';

interface IBattleResult {
  company: Company;
  onClickCompany: (companyId: string) => void;
  isWinner: boolean;
}

export function BattleResult({
  company,
  onClickCompany,
  isWinner,
}: IBattleResult) {
  return (
    <button
      className={'relative w-28 h-24'}
      onClick={() => onClickCompany(company.id)}
    >
      <Image
        className="w-full"
        src={`/logos/${company.imageName}`}
        width={100}
        height={100}
        alt={company.name}
      />
      {!isWinner && (
        <Image
          className={'w-full top-0 left-0 absolute opacity-80'}
          src={'/x.png'}
          width={64}
          height={64}
          alt={'X'}
        />
      )}
    </button>
  );
}
