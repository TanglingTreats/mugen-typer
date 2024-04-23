import Challenge from "./challenge"

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-between p-5 md:p-10">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-2xl lg:flex">
        <p className="text-center text-white title"> 無限 </p>
      </div>

      <Challenge className="relative flex place-items-start justify-center text-2xl w-screen -mt-14 h-[172px] md:h-[204px] overflow-hidden" />

      <div className="mb-2 grid text-center text-xs lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left text-white">
        <p className="text-center">Theme: Gruvbox. Still a WIP.</p>
        <p className="text-center">Thanks for visiting</p>
        <p className="text-center">Backend development is in progress.</p>
        <p className="text-center">
          Credits to Nikolay Talanov for the codepen infinity animation
          Will likely change it fit my idea better and properly learn SVG
        </p>
      </div>
    </main>
  );
}
