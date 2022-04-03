import { useState, useEffect, useCallback } from 'react'

import * as fcl from "@onflow/fcl"
import bayouService from '../lib/bayouService'
import publicConfig from '../publicConfig'
import Decimal from 'decimal.js'

export default function RecipientsInput(props) {
  const [rawRecordsStr, setRawRecordsStr] = useState('')
  const [recordsSum, setRecordsSum] = useState(0)
  const [validRecords, setValidRecords] = useState([])
  const [unpreparedRecords, setUnpreparedRecords] = useState([])
  const [invalidRecords, setInvalidRecords] = useState([])
  const [processError, setProcessError] = useState(null)
  const [txid, setTxid] = useState(null)
  const [txStatus, setTxStatus] = useState(null)
  const [processState, setProcessState] = useState({
    disabled: false, 
    bg_color: "bg-flow-green",
    text: "Process"
  })

  const cleanStatus = useCallback(() => {
    setProcessError(null)
    setValidRecords([])
    setUnpreparedRecords([])
    setInvalidRecords([])
    cleanTxInfo()
  }, [])

  const cleanTxInfo = () => {
    setTxid(null)
    setTxStatus(null)
  }

  const Pending = 'Pending'
  const Sealed = 'Sealed'
  const ExecutionFailed = 'Execution Failed'
  const Rejected = 'Transaction Rejected'
  const TransactionStatus = {
    Pending,
    Sealed,
    ExecutionFailed,
    Rejected
  }

  useEffect(() => {
    cleanStatus()
  }, [props.selectedToken, cleanStatus])

  const filterRecordsOnChain = async (token, records) => {
    let tasks = []
    let preparedRecords = []
    let unpreparedRecords = []

    records.map(async (record) => {
      let task = new Promise(async (resolve, reject) => {
        let prepared = await bayouService.queryReceiver(token, record.address)
        if (prepared === true) {
          preparedRecords.push(record)
        } else {
          unpreparedRecords.push(record)
        }
        resolve(prepared)
      })
      tasks.push(task)
    })

    await Promise.all(tasks)
    setRecordsSum(preparedRecords.reduce((p, c) => { 
      return p.add(c.amount)
    }, new Decimal(0)))

    preparedRecords.sort((a, b) => {return a.id - b.id})
    unpreparedRecords.sort((a, b) => {return a.id - b.id})

    return [preparedRecords, unpreparedRecords]
  }

  const filterRecords = (rawRecordsStr) => {
    const rawRecords = rawRecordsStr.split("\n")

    let records = []
    let invalidRecords = []
    for (var i = 0; i < rawRecords.length; i++) {
      let rawRecord = rawRecords[i]
      try {
        const [address, rawAmount] = rawRecord.split(",")
        const amount = new Decimal(rawAmount)
        if (!amount.isPositive() || amount.decimalPlaces() > 8) { throw "invalid amount" }

        if (!address.startsWith("0x") || address.length != 18) { throw "invalid address" }
        const bytes = Buffer.from(address.replace("0x", ""), "hex")
        if (bytes.length != 8) { throw "invalid address" }

        records.push({id: i, address: address, amount: amount, rawRecord: rawRecord})
      } catch (e) {
        invalidRecords.push(rawRecord)
      }
    } 
    return [records, invalidRecords]
  }

  return (
    <div className={props.className}>
      <label className="block text-2xl font-bold font-flow">
        Recipients & Amounts
      </label>
      <label className="block font-flow text-md leading-10">
        For each line, enter one address and the token amount, seperate with comma.
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
      <div className="flex gap-x-4 items-end h-20">
        <button
            type="button"
            disabled={processState.disabled}
            className={`h-14 left-0 justify-self-end inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black ${processState.bg_color} hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green`}
            onClick={async () => {
              cleanStatus()
              if (props.selectedToken && rawRecordsStr.trim().length > 0) {
                const [records, invalid] = filterRecords(rawRecordsStr.trim())
                setProcessState({disabled: true, bg_color: "bg-flow-green-dark", text: "Processing"})
                const [prepared, unprepared] = await filterRecordsOnChain(props.selectedToken, records)
                setProcessState({disabled: false, bg_color: "bg-flow-green", text: "Process"})
  
                setValidRecords(prepared)
                setUnpreparedRecords(unprepared)
                setInvalidRecords(invalid)
              } else {
                setProcessError('Please select token, input recipients and amounts')
              }
            }}
            >
            {processState.text}
        </button>
        {
          processError && (
            <div className="min-w-0 flex flex-col justify-center h-14 justify-self-end">
              {<label className="font-flow text-md text-rose-500">{processError}</label>}
            </div>
          )
        }
      </div>
      {
        validRecords.length > 0 && (
          <>
          <label className="block mt-20 text-2xl font-bold font-flow">Confirm</label>
          <div className="mt-1 mb-30">
            <ul role="list">
              <li key="title">
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Address
                  </div>
                  <div className="grow"></div>
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Amount ({props.selectedToken && props.selectedToken.symbol})
                  </div>
                </div>
              </li>
            {
              validRecords.map((record, index) => (
                <li key={index}>
                  <div className="flex items-center">
                    <div className="flex-none w-30 text-lg font-flow leading-10">
                      {record.address}
                    </div>
                    <div className="grow border-b mx-2 border-black"></div>
                    <div className="flex-none w-30 text-lg font-flow leading-10">
                      {record.amount.toString()}
                    </div>
                  </div>
                </li>
              ))
            }
              <li key="total">
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Total
                  </div>
                  <div className="grow"></div>
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    {recordsSum.toString()} {props.selectedToken && props.selectedToken.symbol} 
                  </div>
                </div>
              </li>
              <li key="balance">
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Your Balance
                  </div>
                  <div className="grow"></div>
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    {props.tokenBalance.toString()} {props.selectedToken && props.selectedToken.symbol}
                  </div>
                </div>
              </li>
              <li key="remaining">
                <div className="flex items-center">
                  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                    Remaining
                  </div>
                  <div className="grow"></div>
                  {
                    !(props.tokenBalance.sub(recordsSum).isNegative())
                    ?  <div className="flex-none w-30 text-md font-flow font-semibold leading-10">
                      {props.tokenBalance.sub(recordsSum).toString()} {props.selectedToken && props.selectedToken.symbol}
                    </div>
                    : <div className="flex-none w-30 text-md text-rose-500 font-flow font-semibold leading-10">
                      {props.tokenBalance.sub(recordsSum).toString()} {props.selectedToken && props.selectedToken.symbol}
                    </div>
                  }
                </div>
              </li>
            </ul>
          </div>
          <div className="flex gap-x-4 mt-8 items-end h-14 mb-30">
            <button
                type="button"
                className="justify-self-end h-14 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
                onClick={async () => {
                  cleanTxInfo()
                  if (props.selectedToken) {
                    try {
                      const transactionId = await bayouService.batchTransfer(props.selectedToken, validRecords)
                      setTxid(transactionId)
                      setTxStatus(TransactionStatus.Pending)
                  
                      await fcl.tx(transactionId).onceSealed()
                      setTxStatus(TransactionStatus.Sealed)
                    } catch (e) {
                      if (typeof e === "string" && e.includes("Execution failed")) {
                          setTxStatus(TransactionStatus.ExecutionFailed)
                      } else if (typeof e === "object" && e.message.includes("Declined")) {
                          setTxStatus(TransactionStatus.Rejected)
                      }
                    }
                  }
                }}
                >
                Transfer
            </button>
            {
              txStatus && (
                <div className="min-w-0 flex flex-col justify-center h-14 justify-self-end">
                  {
                    txStatus == TransactionStatus.Sealed
                    ? <label className="font-flow text-md text-flow-green">
                    Status: {txStatus}
                    </label>
                    : (txStatus == TransactionStatus.ExecutionFailed || txStatus == TransactionStatus.Rejected) 
                    ? <label className="font-flow text-md text-rose-500">
                    Status: {txStatus}
                    </label>
                    : <label className="font-flow text-md">
                    Status: {txStatus}
                    </label>
                  }

                  {txid && (
                    <a 
                    href={`${publicConfig.flowscanURL}/transaction/${txid}`} 
                    rel="noopener noreferrer"
                    target="_blank" className="truncate font-flow text-sm leading-6 underline decoration-flow-green decoration-2">
                      {`${txid}`}
                    </a >
                  )}
                </div>
              )
            }

          </div>
          </>
        )
      }
      {(unpreparedRecords.length > 0 || invalidRecords.length > 0) && (
        <label className="block mt-20 text-2xl font-bold font-flow">Invalid Entries</label>
      )} 
      {
        unpreparedRecords.length > 0 && (
          <>
            <label className="block font-flow text-md leading-10">
            Due to a lack of Receiver in account
            </label>
            <div className="mt-1">
              <textarea
                rows={unpreparedRecords.length > 8 ? 8 : unpreparedRecords.length}
                name="unprepared"
                id="unprepared"
                className="focus:ring-rose-700 focus:border-rose-700 bg-rose-300/10 resize-none block w-full border-rose-700 font-flow text-lg placeholder:text-gray-300"
                disabled={true}
                defaultValue={(unpreparedRecords.reduce((p, c) => { return `${p}\n${c.rawRecord}`}, '')).trim()}
                spellCheck={false}
              />
            </div>
          </>
        )
      }
      {
        invalidRecords.length > 0 && (
          <>
            <label className="block font-flow text-md leading-10">
            Due to invalid format
            </label>
            <div className="mt-1">
              <textarea
                rows={invalidRecords.length > 8 ? 8 : invalidRecords.length}
                name="invalid"
                id="invalid"
                className="focus:ring-rose-700 focus:border-rose-700 bg-rose-300/10 resize-none block w-full border-rose-700 font-flow text-lg placeholder:text-gray-300"
                disabled={true}
                defaultValue={(invalidRecords.reduce((p, c) => { return `${p}\n${c}`}, '')).trim()}
                spellCheck={false}
              />
            </div>
          </>
        )
      }

      <div className="h-28"></div>
    </div>
  )
}