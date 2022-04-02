import Image from "next/image"
import publicConfig from "../publicConfig"

export default function NavigationBar() {
  return (
    <>
      <div className="relative gap-x-2 flex items-center bg-white h-48">
        <Image src="/bayou.png" alt="" width={50} height={50} priority />
        <label className="font-flow font-bold text-3xl">
          bayou
        </label>
        <label className="font-flow text-flow-green border border-flow-green text-sm whitespace-pre"> {publicConfig.chainEnv} </label>
        <a 
          href={"https://github.com/33-Labs/bayou"}
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute right-0">
            <Image src="/github.png" alt="" width={24} height={24} priority />
        </a>
      </div>
    </>
  )
}