import Link from "next/link"

const MobileNavigation = () => {
  return (
    <>
      <div className="lg:hidden block fixed bottom-0 inset-x-0 z-10 bg-white dark:bg-gray-900 shadow">
        <div id="tabs" className="flex justify-between mx-auto max-w-screen-xl px-4 dark:text-white">
          <Link href="/" className="svg-body w-full focus:text-teal-500 justify-center inline-block text-center pt-2 pb-1 ">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block mb-1 dark:text-white" width="25" height="25" viewBox="0 0 24 24" id="home"><path fill="currentColor" d="M6.63477851,18.7733424 L6.63477851,15.7156161 C6.63477851,14.9350667 7.27217143,14.3023065 8.05843544,14.3023065 L10.9326107,14.3023065 C11.310188,14.3023065 11.6723007,14.4512083 11.9392882,14.7162553 C12.2062757,14.9813022 12.3562677,15.3407831 12.3562677,15.7156161 L12.3562677,18.7733424 C12.3538816,19.0978491 12.4820659,19.4098788 12.7123708,19.6401787 C12.9426757,19.8704786 13.2560494,20 13.5829406,20 L15.5438266,20 C16.4596364,20.0023499 17.3387522,19.6428442 17.9871692,19.0008077 C18.6355861,18.3587712 19,17.4869804 19,16.5778238 L19,7.86685918 C19,7.13246047 18.6720694,6.43584231 18.1046183,5.96466895 L11.4340245,0.675869015 C10.2736604,-0.251438297 8.61111277,-0.221497907 7.48539114,0.74697893 L0.967012253,5.96466895 C0.37274068,6.42195254 0.0175522924,7.12063643 0,7.86685918 L0,16.568935 C0,18.4638535 1.54738155,20 3.45617342,20 L5.37229029,20 C6.05122667,20 6.60299723,19.4562152 6.60791706,18.7822311 L6.63477851,18.7733424 Z" transform="translate(2.5 2)"></path></svg>
            <span className="tab tab-home block text-xs">Home</span>
          </Link>

          <Link href="/create-listing" className="w-full svg-body focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <svg className="inline-block mb-1 dark:text-white" width="25" height="25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="plus"><path fill="currentColor" d="M14.6602,0.0001 C18.0602,0.0001 20.0002,1.9201 20.0002,5.3301 L20.0002,5.3301 L20.0002,14.6701 C20.0002,18.0601 18.0702,20.0001 14.6702,20.0001 L14.6702,20.0001 L5.3302,20.0001 C1.9202,20.0001 0.0002,18.0601 0.0002,14.6701 L0.0002,14.6701 L0.0002,5.3301 C0.0002,1.9201 1.9202,0.0001 5.3302,0.0001 L5.3302,0.0001 Z M9.9902,5.5101 C9.5302,5.5101 9.1602,5.8801 9.1602,6.3401 L9.1602,6.3401 L9.1602,9.1601 L6.3302,9.1601 C6.1102,9.1601 5.9002,9.2501 5.7402,9.4001 C5.5902,9.5601 5.5002,9.7691 5.5002,9.9901 C5.5002,10.4501 5.8702,10.8201 6.3302,10.8301 L6.3302,10.8301 L9.1602,10.8301 L9.1602,13.6601 C9.1602,14.1201 9.5302,14.4901 9.9902,14.4901 C10.4502,14.4901 10.8202,14.1201 10.8202,13.6601 L10.8202,13.6601 L10.8202,10.8301 L13.6602,10.8301 C14.1202,10.8201 14.4902,10.4501 14.4902,9.9901 C14.4902,9.5301 14.1202,9.1601 13.6602,9.1601 L13.6602,9.1601 L10.8202,9.1601 L10.8202,6.3401 C10.8202,5.8801 10.4502,5.5101 9.9902,5.5101 Z" transform="translate(2 2)"></path></svg>
            <span className="tab tab-explore block text-xs">New List</span>
          </Link>
          <Link href="/my-listings" className="w-full svg-body focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <svg className="inline-block mb-1 dark:text-white" width="28" height="25" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" id="list"><path fill="currentColor" d="M31.544 12.932a1.5 1.5 0 0 1 1.5-1.5h18.87a1.5 1.5 0 0 1 0 3h-18.87a1.5 1.5 0 0 1-1.5-1.5Zm20.37 4.841h-22.87a1.5 1.5 0 0 0 0 3h22.87a1.5 1.5 0 0 0 0-3Zm0 10.727h-18.87a1.5 1.5 0 1 0 0 3h18.87a1.5 1.5 0 0 0 0-3Zm0 6.343h-22.87a1.5 1.5 0 1 0 0 3h22.87a1.5 1.5 0 0 0 0-3ZM20.77 26.16h-8.68a1.5 1.5 0 0 0-1.5 1.5v8.68a1.5 1.5 0 0 0 1.5 1.5h8.68a1.5 1.5 0 0 0 1.5-1.5v-8.68a1.5 1.5 0 0 0-1.5-1.5Zm0-17.07h-8.68a1.5 1.5 0 0 0-1.5 1.5v8.68a1.5 1.5 0 0 0 1.5 1.5h8.68a1.5 1.5 0 0 0 1.5-1.5v-8.68a1.5 1.5 0 0 0-1.5-1.5Zm0 34.14h-8.68a1.5 1.5 0 0 0-1.5 1.5v8.68a1.5 1.5 0 0 0 1.5 1.5h8.68a1.5 1.5 0 0 0 1.5-1.5v-8.68a1.5 1.5 0 0 0-1.5-1.5Zm31.144 2.338h-18.87a1.5 1.5 0 1 0 0 3h18.87a1.5 1.5 0 0 0 0-3Zm0 6.343h-22.87a1.5 1.5 0 1 0 0 3h22.87a1.5 1.5 0 0 0 0-3Z"></path></svg>
            <span className="tab tab-whishlist block text-xs">My Listings</span>
          </Link>
          <Link href="/my-profile"  className="svg-body w-full  focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <svg width="25" height="25" className="inline-block dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="account"><path fill="currentColor" d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2ZM10,26.39a6,6,0,0,1,11.94,0,11.87,11.87,0,0,1-11.94,0Zm13.74-1.26a8,8,0,0,0-15.54,0,12,12,0,1,1,15.54,0ZM16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,16,16Z"></path></svg>
            <span className="tab tab-account block text-xs">Account</span>
          </Link>

          <Link href="/chat" className="svg-body w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1">
            <svg width="25" height="25" viewBox="0 0 24 24" className="inline-block mb-1 dark:text-white">
              <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            <span className="tab tab-chats block text-xs">Chats</span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default MobileNavigation