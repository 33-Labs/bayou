import { useState, useEffect } from 'react'

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export default function RecipientsInput(props) {
  const [rawRecordsStr, setRawRecordsStr] = useState('')
  const [recordsSum, setRecordsSum] = useState(0)
  const [validRecords, setValidRecords] = useState([])
  const [unpreparedRecords, setUnpreparedRecords] = useState([])
  const [invalidRecords, setInvalidRecords] = useState([])

  useEffect((token) => {
    setValidRecords([])
    setUnpreparedRecords([])
    setInvalidRecords([])
  }, [props.selectedToken])

  const batchTransfer = async (token, records) => {
    const recipients = records.map((record) => {return record.address})
    const amounts = records.map((record) => {return record.amount.toFixed(8).toString()})
    const code = `
      import FungibleToken from 0xFungibleToken
      import ${token.contractName} from ${token.contractAddress}

      transaction(recipients: [Address], amounts: [UFix64]) {

          let vaultRef: &${token.contractName}.Vault

          prepare(signer: AuthAccount) {
              // Get a reference to the signer's stored vault
              self.vaultRef = signer.borrow<&${token.contractName}.Vault>(from: ${token.providerPath})
                  ?? panic("Could not borrow reference to the owner's Vault!")
          }

          pre {
              recipients.length == amounts.length: "invalid params"
          }

          execute {
              var counter = 0

              while (counter < recipients.length) {
                  // Get the recipient's public account object
                  let recipientAccount = getAccount(recipients[counter])

                  // Get a reference to the recipient's Receiver
                  let receiverRef = recipientAccount.getCapability(${token.receiverPath})!
                      .borrow<&{FungibleToken.Receiver}>()
                      ?? panic("Could not borrow receiver reference to the recipient's Vault")

                  // Deposit the withdrawn tokens in the recipient's receiver
                  receiverRef.deposit(from: <-self.vaultRef.withdraw(amount: amounts[counter]))

                  counter = counter + 1
              }
          }
      }
    `
    .replace("0xFungibleToken", "0x9a0766d93b6608b7")
  
    const transactionId = await fcl.mutate({
      cadence: code,
      args: (arg, t) => [arg(recipients, t.Array(t.Address)), arg(amounts, t.Array(t.UFix64))],
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      limit: 9999
    })

    return transactionId
  }

  const queryReceiver = async (token, address) => {
    const code = `
      import FungibleToken from 0xFungibleToken
      import ${token.contractName} from ${token.contractAddress}
      
      pub fun main(address: Address): Bool {
          let account = getAccount(address)
      
          let vaultRef = account
              .getCapability(${token.receiverPath})
              .borrow<&${token.contractName}.Vault{FungibleToken.Receiver}>()
          
          if let vault = vaultRef {
            return true
          }
          return false 
      }
    `
    .replace("0xFungibleToken", "0x9a0766d93b6608b7")

    const prepared = await fcl.query({
      cadence: code,
      args: (arg, t) => [arg(address, t.Address)]
    }) 

    return prepared ?? false
  }

  const filterRecordsOnChain = async (token, records) => {
    let tasks = []
    let preparedRecords = []
    let unpreparedRecords = []
    records.map(async (record) => {
      let task = new Promise(async (resolve, reject) => {
        let prepared = await queryReceiver(token, record.address)
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

    setRecordsSum(preparedRecords.reduce((p, c) => { return p + c.amount }, 0.0))

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
        const amount = Number(rawAmount)
        if (isNaN(amount) || amount <= 0 ) { throw "invalid amount" }

        if (!Number.isInteger(amount)) {
          const [integer, digits] = rawAmount.split(".")
          if (digits.length > 8) { throw "invalid amount" }
        }

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
            onClick={async () => {
              if (props.selectedToken && rawRecordsStr.trim().length > 0) {
                const [records, invalid] = filterRecords(rawRecordsStr)
                const [prepared, unprepared] = await filterRecordsOnChain(props.selectedToken, records)
  
                setValidRecords(prepared)
                setUnpreparedRecords(unprepared)
                setInvalidRecords(invalid)
              }
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
              <li key="title">
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
              validRecords.map((record, index) => (
                <li key={index}>
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
              <li key="total">
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
              <li key="balance">
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
              <li key="remaining">
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
          <div className="relative flex items-end h-20 mb-30">
            <button
                type="button"
                className="absolute right-0 justify-self-end inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-black bg-flow-green hover:bg-flow-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flow-green"
                onClick={async () => {
                  if (props.selectedToken) {
                    const txid = await batchTransfer(props.selectedToken, validRecords)
                    console.log("txid: " + txid)
                  }
                }}
                >
                Transfer
            </button>
          </div>
          </>
        )
      }
      {(unpreparedRecords.length > 0 || invalidRecords.length > 0) && (
        <label className="block mt-20 text-2xl font-bold font-flow">Filtered Out Records</label>
      )} 
      {
        unpreparedRecords.length > 0 && (
          <>
            <label className="block font-flow text-md leading-10">
            Due to uninitialized accounts
            </label>
            <div className="mt-1">
              <textarea
                rows={unpreparedRecords.length}
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
                rows={invalidRecords.length}
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