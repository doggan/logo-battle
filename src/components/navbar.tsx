'use client';

import Link from 'next/link';
import Image from 'next/image';
import logoImage from '@/public/logo.png';
import { useState } from 'react';
import fnv1a from 'next/dist/shared/lib/fnv1a';
import { func } from 'ts-interface-checker';

interface INavLinkProps {
  href: string;
  text: string;
  onClick: () => void;
}

function NavLink({ href, text, onClick }: INavLinkProps) {
  return (
    <Link
      onClick={onClick}
      className="hover:text-white text-xs font-normal"
      scroll={false}
      href={href}
    >
      {text}
    </Link>
  );
}

export function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="sticky w-full top-0 z-20 flex flex-wrap items-center justify-between py-2 mb-3 bg-zinc-800">
      <div className="relative container px-4 mx-auto flex flex-wrap items-center justify-between min-h-[42px]">
        <div className={'absolute top-0 left-0 ml-4'}>
          <Link href={'/'}>
            <Image
              src={'/logo-no-background.png'}
              width={140}
              height={40}
              alt={'Logo Battle'}
              priority={true}
            />
          </Link>
        </div>
        <div className="w-full relative flex justify-end md:w-auto md:static md:block md:justify-start">
          <button
            className="text-white cursor-pointer text-xl leading-none px-3 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={
            'md:flex flex-grow items-center justify-center' +
            (navbarOpen ? ' flex' : ' hidden')
          }
        >
          <ul className="flex flex-col md:flex-row list-none place-items-center justify-center md:space-x-8 space-y-4 md:space-y-0 text-zinc-400 font-bold uppercase tracking-widest text-sm">
            <li className="nav-item">
              <NavLink
                href={'/'}
                text={'Battle'}
                onClick={() => setNavbarOpen(false)}
              />
            </li>
            <li className="nav-item">
              <NavLink
                href={'/leaderboard'}
                text={'Leaderboard'}
                onClick={() => setNavbarOpen(false)}
              />
            </li>
            <li className="nav-item">
              <NavLink
                href={'/recent'}
                text={'Recent'}
                onClick={() => setNavbarOpen(false)}
              />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
