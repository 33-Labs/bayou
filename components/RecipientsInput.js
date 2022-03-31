import { useState } from 'react'

import * as fcl from "@onflow/fcl";

export default function RecipientsInput(props) {
  const [rawRecordsStr, setRawRecordsStr] = useState('')
  const [recordsSum, setRecordsSum] = useState(0)
  const [validRecords, setValidRecords] = useState([])
  const [unpreparedRecords, setUnpreparedRecords] = useState([])
  const [invalidRecords, setInvalidRecords] = useState([])

  const checkAddresses = (addresses) => {

  }

  const filterRecords = (rawRecordsStr) => {
    const rawRecords = rawRecordsStr.split("\n")

    let records = []
    let invalidRecords = []
    for (var i = 0; i < rawRecords.length; i++) {
      let rawRecord = rawRecords[i]
      try {
        const [address, rawAmount] = rawRecord.split(",")
        const amount = Number(rawAmount)
        if (isNaN(amount) || amount <= 0 ) { throw "invalid amount" }

        if (!Number.isInteger(amount)) {
          const [integer, digits] = rawAmount.split(".")
          if (digits.length > 8) { throw "invalid amount" }
        }

        if (!address.startsWith("0x") || address.length != 18) { throw "invalid address" }
        const bytes = Buffer.from(address.replace("0x", ""), "hex")
        if (bytes.length != 8) { throw "invalid address" }

        records.push({address: address, amount: amount})
      } catch (e) {
        console.log(e)
        invalidRecords.push(rawRecord)
      }
    } 

    for (var i = 0; i < records.length; i++) {

    }

    setRecordsSum(records.reduce((p, c) => { return p + c.amount }, 0.0))
    
    return [records, invalidRecords]
  }

  return (
    <div className={props.className}>
      <label className="block text-2xl font-bold font-flow">
        Recipients & Amounts
      </label>
      <label className="block font-flow text-md leading-10">
      Enter one address and token amount on each line. Seperate with comma.
      </label>
      <div className="mt-1">
        <textarea
          rows={8}
          name="records"
          id="records"
          className="focus:ring-flow-green-dark focus:border-flow-green-dark bg-flow-green/10 resize-none block w-full border-flow-green font-flow text-lg placeholder:text-gray-300"
          defaultValue={''}
          spellCheck={false}
          placeholder={
            "0xf8d6e0586b0a20c7,1.6"
          }
          onChange={(event) => {setRawRecordsStr(event.target.value)}}
        />
      </div>
      <div className="relative flex items-end h-20">
        <button
            type="button"
            className="absolute right-0 justify-self-end inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
            onClick={() => {
              const [records, invalidRecords] = filterRecords(rawRecordsStr)
              console.log(records)
              console.log(invalidRecords)
              setValidRecords(records)
              setInvalidRecords(invalidRecords)
            }}
            >
            Check
        </button>
      </div>
      {
        validRecords.length > 0 && (
          <>
          <label className="block mt-20 text-2xl font-bold font-flow">Confirm</label>
          <div className="mt-1 mb-30">
            <ul role="list">
              <li>
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Address
                  </div>
                  <div className="grow"></div>
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Amount
                  </div>
                </div>
              </li>
            {
              validRecords.map((record) => (
                <li>
                  <div className="flex items-center">
                    <div className="flex-none w-30 text-lg font-flow leading-10">
                      {record.address}
                    </div>
                    <div className="grow border-b mx-2 border-black"></div>
                    <div className="flex-none w-30 text-lg font-flow leading-10">
                      {record.amount}
                    </div>
                  </div>
                </li>
              ))
            }
              <li>
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Total
                  </div>
                  <div className="grow"></div>
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    {recordsSum} {props.selectedToken && props.selectedToken.symbol} 
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Your Balance
                  </div>
                  <div className="grow"></div>
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    {props.tokenBalance} {props.selectedToken && props.selectedToken.symbol}
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Remaining
                  </div>
                  <div className="grow"></div>
                  {
                    (props.tokenBalance - recordsSum) > 0 
                    ?  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                      {(props.tokenBalance - recordsSum).toFixed(8)} {props.selectedToken && props.selectedToken.symbol}
                    </div>
                    : <div className="flex-none w-30 text-md text-rose-500 font-flow font-semibold leading-10">
                      {(props.tokenBalance - recordsSum).toFixed(8)} {props.selectedToken && props.selectedToken.symbol}
                    </div>
                  }
                </div>
              </li>
            </ul>
          </div>
          </>
        )
      }
      <div className="relative flex items-end h-20 mb-30">
        <button
            type="button"
            className="absolute right-0 justify-self-end inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
            onClick={() => {
              console.log("transfer")
            }}
            >
            Transfer
        </button>
      </div>
      <div className="h-40"></div>
    </div>
  )
}