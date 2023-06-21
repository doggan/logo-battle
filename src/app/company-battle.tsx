import Image from 'next/image';
import { Company } from '@/utils/models';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Spinner } from '@/components/spinner';

interface ILogoProps {
  company?: Company;
  onClick: () => void;
  isWinner?: boolean;
}

function Logo({ company, onClick, isWinner }: ILogoProps) {
  const boxBorderClassname = 'w-64 h-64 md:w-80 md:h-80 shadow-md p-4';

  if (!company) {
    return (
      <div className={boxBorderClassname}>
        <Spinner />
      </div>
    );
  }

  const showWinner = isWinner !== undefined && isWinner;
  const showLoser = isWinner !== undefined && !isWinner;

  return (
    <div>
      <div
        className={clsx({
          [boxBorderClassname]: true,
          'winner-selected': showWinner,
        })}
      >
        <button className={'relative w-full h-full'} onClick={onClick}>
          <Image
            className="w-full"
            src={`/logos/${company.imageName}`}
            width={200}
            height={200}
            alt={company.name}
          />
          {(showWinner || showLoser) && (
            <Image
              className={'w-full top-0 left-0 absolute opacity-80'}
              src={showWinner ? '/o.png' : '/x.png'}
              width={200}
              height={200}
              alt={showWinner ? 'O' : 'X'}
            />
          )}
        </button>
      </div>
    </div>
  );
}

enum BattleState {
  Company1Won,
  Company2Won,
  Idle,
}

interface ICompanyBattleDisplayProps {
  company1?: Company;
  company2?: Company;
  onSelectWinner: (didCompany1Win: boolean) => void;
  battleState: BattleState;
}

/**
 * The actual battle display that shows the two logos of the battling companies.
 * We split the display into a separate component from the actual battle,
 * since this allows a new battle to be requested while we're still showing
 * animations or other effects on the finished battle.
 */
function CompanyBattleDisplay({
  company1,
  company2,
  onSelectWinner,
  battleState,
}: ICompanyBattleDisplayProps) {
  return (
    <div
      className={'p-8 flex justify-between items-center flex-col md:flex-row'}
    >
      <Logo
        company={company1}
        isWinner={
          battleState === BattleState.Idle
            ? undefined
            : battleState === BattleState.Company1Won
        }
        onClick={() => onSelectWinner(true)}
      />
      <div className={'p-5'}>vs.</div>
      <Logo
        company={company2}
        isWinner={
          battleState === BattleState.Idle
            ? undefined
            : battleState === BattleState.Company2Won
        }
        onClick={() => onSelectWinner(false)}
      />
    </div>
  );
}

interface ICompanyBattleProps {
  company1?: Company;
  company2?: Company;
  onRequestNewBattle: () => void;
}

/**
 * The minimum time to show the battle results before showing a new battle.
 * The underlying http requests will be made in parallel, but if the requests
 * finish before this time, the next battle won't be shown until this time has
 * elapsed.
 */
const MIN_BATTLE_TIME_MS = 1000;

export function CompanyBattle({
  company1,
  company2,
  onRequestNewBattle,
}: ICompanyBattleProps) {
  const [battleState, setBattleState] = useState<BattleState>(BattleState.Idle);
  const [activeCompanies, setActiveCompanies] = useState<
    [Company, Company] | null
  >(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!company1 || !company2) {
      return;
    }
    if (
      activeCompanies &&
      activeCompanies[0] === company1 &&
      activeCompanies[1] === company2
    ) {
      return;
    }

    const endTime = Date.now();

    const doWork = () => {
      setBattleState(BattleState.Idle);
      setActiveCompanies([company1, company2]);
    };

    const timeDiff = endTime - (startTime ?? endTime);
    if (!activeCompanies || timeDiff > MIN_BATTLE_TIME_MS) {
      doWork();
    } else {
      const timer = setTimeout(() => doWork(), MIN_BATTLE_TIME_MS - timeDiff);
      return () => clearTimeout(timer);
    }
  }, [activeCompanies, startTime, company1, company2]);

  const onSelectWinnerHandler = async (didCompany1Win: boolean) => {
    if (!activeCompanies) {
      return;
    }
    // Ignore multiple clicks if we're already handling a battle.
    if (battleState !== BattleState.Idle) {
      return;
    }

    setStartTime(Date.now());
    setBattleState(
      didCompany1Win ? BattleState.Company1Won : BattleState.Company2Won,
    );

    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId1: activeCompanies[0].id,
        companyId2: activeCompanies[1].id,
        didVoteForCompany1: didCompany1Win,
      }),
    });
    // TOOD: error handling

    console.log('### response: ');
    console.log(response);

    onRequestNewBattle();
  };

  return (
    <CompanyBattleDisplay
      company1={activeCompanies ? activeCompanies[0] : undefined}
      company2={activeCompanies ? activeCompanies[1] : undefined}
      onSelectWinner={onSelectWinnerHandler}
      battleState={battleState}
    />
  );
}
