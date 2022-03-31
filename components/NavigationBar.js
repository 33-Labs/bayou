
export default function NavigationBar() {
  return (
    <>
      <div className="relative flex items-center bg-white h-48">
        <label className="absolute font-flow font-bold text-4xl">
          Bayou
        </label>
        <button
          type="button"
          className="absolute right-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
          >
          Connect Wallet
        </button>
      </div>
    </>
  )
}