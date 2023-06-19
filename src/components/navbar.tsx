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
      className="hover:text-white text-xs"
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
    <nav className="sticky w-full top-0 z-20 flex flex-wrap items-center justify-between py-2 md:py-3 bg-zinc-800 mb-3">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className={'absolute top-0 left-0 mt-2 ml-4'}>
          <Link href={'/'}>
            <Image
              src={'/logo-no-background.png'}
              width={100}
              height={50}
              alt={'Logo Battle'}
            />
          </Link>
        </div>
        <div className="w-full relative flex justify-end md:w-auto md:static md:block md:justify-start">
          <button
            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none"
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
  // return (
  //   <nav className="bg-white border-gray-200 dark:bg-gray-900">
  //     <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  //       <a href="/" className="flex items-center">
  //         <Image
  //           priority={true}
  //           src={logoImage}
  //           alt={'Logo Battle Logo'}
  //           className={'w-40'}
  //         />
  //       </a>
  //       <button
  //         data-collapse-toggle="navbar-default"
  //         type="button"
  //         className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  //         aria-controls="navbar-default"
  //         aria-expanded="false"
  //       >
  //         <span className="sr-only">Open main menu</span>
  //         <svg
  //           className="w-6 h-6"
  //           aria-hidden="true"
  //           fill="currentColor"
  //           viewBox="0 0 20 20"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             fillRule="evenodd"
  //             d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
  //             clipRule="evenodd"
  //           ></path>
  //         </svg>
  //       </button>
  //       <div className="hidden w-full md:block md:w-auto" id="navbar-default">
  //         <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
  //           <li>
  //             <NavLink href={'/'} text={'Battle'} />
  //           </li>
  //           <li>
  //             <NavLink href={'/leaderboard'} text={'Leaderboard'} />
  //           </li>
  //           <li>
  //             <NavLink href={'/recent'} text={'Recent'} />
  //           </li>
  //         </ul>
  //       </div>
  //     </div>
  //   </nav>
  // );
}
