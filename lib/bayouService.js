import publicConfig from "../publicConfig"
import * as fcl from "@onflow/fcl"
import Decimal from 'decimal.js'

const fungibleTokenPath = "0xFungibleToken"

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
  .replace(fungibleTokenPath, publicConfig.fungibleTokenAddress)

  const prepared = await fcl.query({
    cadence: code,
    args: (arg, t) => [arg(address, t.Address)]
  }) 

  return prepared ?? false
}

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
  .replace(fungibleTokenPath, publicConfig.fungibleTokenAddress)

  const transactionId = await fcl.mutate({
    cadence: code,
    args: (arg, t) => [arg(recipients, t.Array(t.Address)), arg(amounts, t.Array(t.UFix64))],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999
  })
  return transactionId
}

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
  .replace(fungibleTokenPath, publicConfig.fungibleTokenAddress)

  const balance = await fcl.query({
    cadence: code,
    args: (arg, t) => [arg(address, t.Address)]
  }) 

  return new Decimal(balance ?? 0.0)
}


const bayouService = {
  queryReceiver,
  batchTransfer,
  queryBalance
}

export default bayouService