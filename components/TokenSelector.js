import { useState } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'

import * as fcl from "@onflow/fcl";

const tokens = [
  {
    id: 1,
    name: 'Flow Token',
    symbol: "FLOW",
    contractName: "FlowToken",
    contractAddress: "0x7e60df042a9c0868",
    balancePath: "/public/flowTokenBalance",
    receiverPath: "/public/flowTokenReceiver",
    providerPath: "/storage/flowTokenVault",
    imageUrl: '/tokenLogos/FLOW.svg',
  },
  {
    id: 2,
    name: 'Flow USD',
    symbol: "FUSD",
    contractName: "FUSD",
    contractAddress: "0xe223d8a629e49c68",
    receiverPath: "/public/fusdReceiver",
    balancePath: "/public/fusdBalance",
    providerPath: "/storage/fusdVault",
    imageUrl:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAABkCAYAAAB0F0VpAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAABmoAMABAAAAAEAAABkAAAAAHl4y70AAALkaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTAyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xMDA8L2V4aWY6UGl4ZWxZRGltZW5z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'
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TokenSelector(props) {
  const [query, setQuery] = useState('')
  const [selectedToken, setSelectedToken] = useState()
  const [balance, setBalance] = useState('')

  const filteredTokens =
    query === ''
      ? tokens
      : tokens.filter((token) => {
          const content = `${token.name} (${token.symbol})`
          return content.toLowerCase().includes(query.toLowerCase())
        })

  const queryBalance = async (token, address) => {

    const code = `
      import FungibleToken from 0xFungibleToken
      import ${token.contractName} from ${token.contractAddress}
      
      pub fun main(address: Address): UFix64 {
          let account = getAccount(address)
      
          let vaultRef = account
              .getCapability(${token.balancePath})
              .borrow<&${token.contractName}.Vault{FungibleToken.Balance}>()
           
          if let vault = vaultRef {
            return vault.balance
          }
          return 0.0
      }
    `
    .replace("0xFungibleToken", "0x9a0766d93b6608b7")

    const balance = await fcl.query({
      cadence: code,
      args: (arg, t) => [arg(address, t.Address)]
    }) 

    setBalance(balance ?? 0.0)
    props.onBalanceFetched(balance ?? 0.0)
  }

  return (
    <Combobox as="div" className={props.className} value={props.user && props.user.loggedIn && selectedToken} onChange={async (token) => {
      if (props.user && props.user.loggedIn) {
        setBalance(0)
        queryBalance(token, props.user.addr)
  
        setSelectedToken(token)
        props.onTokenSelected(token)
      }
    }}>
      <Combobox.Label className="block text-2xl font-flow font-bold">Token</Combobox.Label>
      {props.user && props.user.loggedIn ? (selectedToken 
        ? <Combobox.Label className="block text-md font-flow leading-10">Your balance is {balance} {selectedToken.symbol}</Combobox.Label>
        : <Combobox.Label className="block text-md font-flow leading-10">Select the token to transfer</Combobox.Label>
      ) : <Combobox.Label className="block text-md font-flow leading-10">Please connect to wallet</Combobox.Label>
      }
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full h-[50px] text-lg font-flow border border-flow-green bg-flow-green/10 py-2 pl-3 pr-10  focus:border-flow-green-dark focus:outline-none focus:ring-1 focus:ring-flow-green-dark"
          onChange={(event) => {
            setQuery(event.target.value)
          }}
          displayValue={(token) => token && `${token.name} (${token.symbol})`}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredTokens.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto  bg-white py-1 text-lg shadow-lg ring-1 ring-flow-green-dark ring-opacity-5 focus:outline-none">
            {filteredTokens.map((token) => (
              <Combobox.Option
                key={token.id}
                value={token}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-flow-green' : 'text-black'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img src={token.imageUrl} alt="" className="h-6 w-6 flex-shrink-0 rounded-full border border-gray-100" />
                      <span className={classNames('ml-3 truncate', selected && 'font-semibold')}>{`${token.name} (${token.symbol})`}</span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-black' : 'text-flow-green-dark'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
