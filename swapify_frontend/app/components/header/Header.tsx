// No longer a client component
import Image from "next/image"
import Link from "next/link"
import LocationSelector from "../location/LocationSelector"

import UserMenu from "./UserMenu"

const Header = async () => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 dark:bg-gray-900/80">
      <div className="max-w-screen-xl mx-auto px-3">
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center transition-transform hover:scale-105">
              <div className="flex items-center gap-1 sm:gap-2 bg-transparent">
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <Image src="/assets/Swapify.jpg" alt="Logo" width={35} height={35} className="rounded-xl sm:w-[45px] sm:h-[45px]" />
                </div>
                <div className="text-black text-xl sm:text-3xl font-bold leading-none dark:text-white ml-1 sm:ml-2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                    Swapify
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Search Bar and Location Selector - Desktop */}
          <div className="hidden lg:flex flex-grow items-center gap-4 max-w-3xl">
            <LocationSelector />
            <form className="flex-grow" action="/search">
              <label htmlFor="default-search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  name="q" 
                  id="default-search" 
                  className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white" 
                  placeholder="Search items..."  
                  required
                />
                <button 
                  type="submit" 
                  className="absolute end-1.5 inset-y-1.5 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all text-white font-medium rounded-lg text-sm px-4 py-1.5"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Chat Icon */}
            <Link 
              href="/chat" 
              className="hidden md:flex items-center p-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </Link>

            {/* Swap It Button */}
            <Link href="/create-listing">
              <button className="relative inline-flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl group transition-all hover:scale-105">
                <span className="px-3 py-2 sm:px-6 sm:py-3 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-semibold rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all">
                  + Swap It
                </span>
              </button>
            </Link>

            {/* User Menu (Desktop) */}
            <div className="hidden lg:block">
              <UserMenu/>
            </div>
          </div>
        </div>

        {/* Mobile View - Updated */}
        <div className="lg:hidden space-y-3">
          {/* Top Row with Logo, Swap Button, and User Menu */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center transition-transform hover:scale-105">
              <div className="flex items-center gap-1">
                <div className="rounded-xl overflow-hidden shadow-md">
                  <Image src="/assets/Swapify.jpg" alt="Logo" width={32} height={32} className="rounded-xl" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text text-xl font-bold">
                  Swapify
                </span>
              </div>
            </Link>

            {/* Right side actions group */}
            <div className="flex items-center gap-2">
              {/* Swap It Button */}
              <Link href="/create-listing">
                <button className="relative inline-flex items-center justify-center overflow-hidden rounded-lg group transition-all hover:scale-105">
                  <span className="px-3 py-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl font-semibold rounded-lg text-xs transition-all">
                    + Swap It
                  </span>
                </button>
              </Link>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>

          {/* Combined Search and Location Bar */}
          <div className="relative">
            <form action="/search" className="relative">
              <LocationSelector isMobile={true} />
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header