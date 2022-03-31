export default function RecipientsInput(props) {
  return (
    <div className={props.className}>
      <label htmlFor="recipients" className="block text-2xl font-bold font-flow">
        Recipients & Amounts
      </label>
      <label className="block font-flow text-md leading-10">
      Enter one address and token amount on each line. Seperate with comma.
      </label>
      <div className="mt-1">
        <textarea
          rows={8}
          name="recipients"
          id="recipients"
          className="focus:ring-flow-green-dark focus:border-flow-green-dark bg-flow-green/10 resize-none block w-full border-flow-green font-flow text-lg placeholder:text-gray-300"
          defaultValue={''}
          spellcheck={false}
          placeholder={
            "0xf8d6e0586b0a20c7,1.6"
          }
        />
      </div>
      <div className="relative">
        <button
            type="button"
            className="absolute mt-8 right-0 justify-self-end inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
            >
            Next
        </button>
      </div>

    </div>
  )
}