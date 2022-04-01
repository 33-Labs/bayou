export default function NavigationBar() {
  return (
    <>
      <div className="relative flex items-center bg-white h-48">
        <label className="absolute font-flow font-bold text-4xl">
          Bayou
        </label>
        <a 
          href="https://flowscan.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute right-0 font-flow text-lg underline">
            Flowscan
        </a>
      </div>
    </>
  )
}