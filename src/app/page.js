import Image from "next/image";
import Challenge from "./challenge"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-2xl lg:flex">
        <p className="text-center text-white"> 無限 </p>
      </div>

      <Challenge className="relative flex place-items-start justify-center text-2xl w-7/12 -mt-14 h-64 overflow-hidden font-mono" />

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left text-white">
        <p>Theme: Gruvbox. Still a WIP.</p>
        <p>Thanks for visiting</p>
        <p>Backend not yet connected</p>
      </div>
    </main>
  );
}
