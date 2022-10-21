import Image from "next/image"
import publicConfig from "../publicConfig"

export default function NavigationBar() {
  return (
    <>
      <div className="gap-x-2 flex items-center justify-between h-44">
        <div className="relative gap-x-2 flex items-center">
          <Image src="/bayou.png" alt="" width={50} height={50} priority />
          <label className="font-flow font-bold text-3xl">
            bayou
          </label>
          {/* <label className="font-flow text-flow-green border border-flow-green text-sm whitespace-pre"> {publicConfig.chainEnv} </label> */}
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="relative w-[25px] h-[25px] rounded-full">
            <Image src="/flow.png" alt="" objectPosition="50% 50%" objectFit="contain" layout="fill" priority />
          </div>
          <div className="relative w-[22px] h-[22px]">
            <a
              href={"https://aptos.bayou33.app"}
              target="_blank"
              rel="noopener noreferrer"
              className="">
              <Image src="/aptos.svg" alt="" objectPosition="50% 50%" objectFit="contain" layout="fill" priority />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}