import Image from 'next/image';
import { Company } from '@/utils/models';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Spinner } from '@/components/spinner';

interface ResultOverlay {
  showWinner: boolean;
  showLoser: boolean;
}

function ResultOverlay({ showWinner, showLoser }: ResultOverlay) {
  const baseClassName = 'object-contain top-0 left-0 absolute opacity-80';

  // We always render both images but use CSS to toggle the visibilty.
  // This guarantees the image will be loaded and ready to display whenever
  // the user clicks on a logo. We need that response to be immediate, so the
  // images need to already be loaded.
  return (
    <>
      <Image
        priority={true}
        className={clsx({
          [baseClassName]: true,
          invisible: !showWinner,
        })}
        src={'/o.png'}
        fill={true}
        alt={'O'}
      />
      <Image
        priority={true}
        className={clsx({
          [baseClassName]: true,
          invisible: !showLoser,
        })}
        src={'/x.png'}
        fill={true}
        alt={'X'}
      />
    </>
  );
}

interface LogoProps {
  company?: Company;
  onClick: () => void;
  isWinner?: boolean;
}

function Logo({ company, onClick, isWinner }: LogoProps) {
  const boxBorderClassname =
    'w-60 h-60 md:w-80 md:h-80 shadow-md p-4 bg-white rounded-sm';

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
    <div
      className={clsx({
        [boxBorderClassname]: true,
        'winner-selected': showWinner,
      })}
    >
      <button
        className={'relative w-full h-full flex justify-center items-center'}
        onClick={onClick}
      >
        {/* We use img instead of NextJS Image class to avoid aspect ratio
          issues on load. When using NextJS Image, the logo will sometimes
           stretch to full width/height ruining the aspect ratio for a split second
           on load. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={'object-contain'}
          src={`/logos/${company.imageName}`}
          alt={company.name}
        />
        <ResultOverlay showWinner={showWinner} showLoser={showLoser} />
      </button>
    </div>
  );
}

enum BattleState {
  Company1Won,
  Company2Won,
  Idle,
}

interface CompanyBattleDisplayProps {
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
}: CompanyBattleDisplayProps) {
  return (
    <div
      className={'flex justify-between items-center flex-col md:flex-row py-4'}
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
      <div className={'py-2 px-6'}>vs.</div>
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

interface CompanyBattleProps {
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
}: CompanyBattleProps) {
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

    const _response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winnerCompanyId: didCompany1Win
          ? activeCompanies[0].id
          : activeCompanies[1].id,
        loserCompanyId: didCompany1Win
          ? activeCompanies[1].id
          : activeCompanies[0].id,
        winnerIsFirst: didCompany1Win,
      }),
    });
    // TOOD: error handling

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
