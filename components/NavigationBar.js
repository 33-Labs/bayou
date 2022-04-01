export default function NavigationBar() {
  return (
    <>
      <div className="relative gap-x-2 flex items-center bg-white h-48">
        <label className="font-flow font-bold text-4xl">
          Bayou
        </label>
        <label className="font-flow text-flow-green border border-flow-green text-sm whitespace-pre"> testnet </label>
        <a 
          href="https://testnet.flowscan.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute right-0 font-flow text-lg underline decoration-flow-green decoration-2">
            Flowscan
        </a>
      </div>
    </>
  )
}