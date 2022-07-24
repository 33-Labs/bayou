export default function CSVSelector(props) {
  const sample = props.sample || "/sample.csv"
  const disabled = props.disabled || false
  return (
    <div className="shrink flex items-center gap-x-2">
      <a href={sample} download
        className="text-flow-green-dark text-base font-medium"
      >Sample</a>
      <div className="shadow-md h-14 px-3
      font-medium text-base text-flow-green-dark bg-flow-green/50
    hover:bg-flow-green-dark hover:text-black"
      >
        <label
          htmlFor="csv-selector"
          className="hidden sm:inline-block w-full text-center leading-[56px] ">
          Upload CSV
        </label>
        <label
          htmlFor="csv-selector"
          className="inline-block sm:hidden w-full text-center leading-[56px] ">
          Upload
        </label>
        <input id="csv-selector" className="hidden w-full" type="file"
          accept=".csv"
          disabled={disabled}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}