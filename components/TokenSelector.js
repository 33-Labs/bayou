import { useState } from 'react'
import Image from 'next/image'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Combobox } from '@headlessui/react'

import TokenList from '../lib/tokenList';
import bayouService from '../lib/bayouService'

const tokens = TokenList()

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

  return (
    <Combobox as="div" className={props.className} value={props.user && props.user.loggedIn && selectedToken} onChange={async (token) => {
      if (props.user && props.user.loggedIn) {
        setBalance(0)
        bayouService.queryBalance(token, props.user.addr).then((balance) => {
          setBalance(balance)
          props.onBalanceFetched(balance)
        })
  
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
