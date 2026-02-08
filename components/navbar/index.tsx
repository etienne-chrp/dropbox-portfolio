'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "visible"
  }, [menuOpen])

  const genericHamburgerLine = `h-[0.2rem] w-5 rounded-full bg-black transition ease transform duration-300 opacity-50 group-hover:opacity-100`;
  return (
    <nav className="h-8 mx-2 flex">
      <div className="relative grow">
        <Link onClick={() => setMenuOpen(false)} href="/" className="logo absolute bottom-0">
          pamela maldonado vallejos
        </Link>
      </div>
      <input type="checkbox" checked={menuOpen} onChange={() => setMenuOpen(!menuOpen)} id="menuBtn"
        className="peer transition-all sm:hidden hidden" />
      <ul className="
        transition-all overflow-hidden z-50

        peer-checked:pt-4
        peer-checked:-mx-2
        peer-checked:px-2
        peer-checked:text-2xl

        text-lg

        h-0 peer-checked:h-full sm:h-full
        fixed sm:relative
        w-full sm:w-auto
        background-color sm:bg-transparent
        
        sm:flex sm:space-x-8 sm:self-end sm:items-end
        "
      >
        <li>
          <Link onClick={() => setMenuOpen(false)} href="/work">work</Link>
        </li>
        <li>
          <Link onClick={() => setMenuOpen(false)} href="/art">art</Link>
        </li>
        <li>
          <Link onClick={() => setMenuOpen(false)} href="/about">about</Link>
        </li>
      </ul>
      <label htmlFor="menuBtn" className="flex flex-col space-y-[0.2rem] justify-center sm:showing sm:hidden z-50">
        <div className={`${genericHamburgerLine} ${menuOpen && "rotate-45 translate-y-[0.4rem]"}`} />
        <div className={`${genericHamburgerLine} ${menuOpen && "opacity-0!"}`} />
        <div className={`${genericHamburgerLine} ${menuOpen && "-rotate-45 -translate-y-[0.4rem]"}`} />
      </label>
    </nav>
  );
};

export default Navbar;