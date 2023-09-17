'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "visible"
  }, [menuOpen])

  const genericHamburgerLine = `h-[0.2rem] w-5 my-[0.2rem] rounded-full bg-black transition ease transform duration-300 opacity-50 group-hover:opacity-100`;
  return (
    <nav className="mx-2 flex">
      <div className="grow">
        <Link onClick={() => setMenuOpen(false)} href="/" className="logo">
          pamela maldonado vallejos
        </Link>
      </div>
      <input type="checkbox" checked={menuOpen} onChange={() => setMenuOpen(!menuOpen)} id="menuBtn"
        className="peer transition-all sm:hidden hidden" />
      <ul className="
        transition-all overflow-hidden

        peer-checked:pt-4
        peer-checked:-mx-2
        peer-checked:px-2

        h-0 peer-checked:h-full sm:h-full
        fixed sm:relative
        w-full sm:w-auto
        background-color sm:bg-transparent
        
        sm:flex sm:space-x-8 sm:self-end
        "
      >
        <li>
          <Link onClick={() => setMenuOpen(false)} href="/work">Work</Link>
        </li>
        <li>
          <Link onClick={() => setMenuOpen(false)} href="/about">About</Link>
        </li>
      </ul>
      <label htmlFor="menuBtn" className="sm:showing sm:hidden">
        <div className={`${genericHamburgerLine} ${menuOpen && "rotate-45 translate-y-[0.4rem]"}`} />
        <div className={`${genericHamburgerLine} ${menuOpen && "!opacity-0"}`} />
        <div className={`${genericHamburgerLine} ${menuOpen && "-rotate-45 -translate-y-[0.4rem]"}`} />
      </label>
    </nav>
  );
};

export default Navbar;