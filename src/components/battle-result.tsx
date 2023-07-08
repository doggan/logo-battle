import { Company } from '@/utils/models';
import Image from 'next/image';

interface BattleResult {
  company: Company;
  onClickCompany: (companyId: string) => void;
  isWinner: boolean;
}

export function BattleResult({
  company,
  onClickCompany,
  isWinner,
}: BattleResult) {
  return (
    <button
      className={'relative w-28 h-28'}
      onClick={() => onClickCompany(company.id)}
    >
      <Image
        className="object-contain"
        src={`/logos/${company.imageName}`}
        fill={true}
        sizes={'200px'}
        alt={company.name}
      />
      {isWinner && (
        <Image
          className={'object-contain top-0 left-0 absolute opacity-80'}
          src={'/o.png'}
          fill={true}
          sizes={'100px'}
          alt={'X'}
        />
      )}
      {!isWinner && (
        <Image
          className={'object-contain top-0 left-0 absolute opacity-80'}
          src={'/x.png'}
          fill={true}
          sizes={'100px'}
          alt={'X'}
        />
      )}
    </button>
  );
}
