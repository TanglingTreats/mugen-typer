import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-2xl lg:flex">
        <p className="text-center text-white"> 無限 </p>
      </div>

      <div className="relative flex place-items-center w-9/12">
        <p className="font-mono text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vestibulum elit ut dui accumsan, eu facilisis erat luctus. Maecenas sed justo id neque tempus tristique quis nec purus. Donec vitae turpis gravida, elementum felis eu, eleifend tellus. Integer pulvinar est et neque luctus iaculis. Proin id consectetur lectus. Nam dignissim malesuada felis, vitae scelerisque justo aliquam sit amet. Maecenas eu posuere diam. Curabitur suscipit auctor felis, quis lobortis magna volutpat quis. Nulla quis magna a elit pharetra finibus. Proin mattis justo vel lacinia euismod.</p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left text-white">
        <p>Footer text here</p>
      </div>
    </main>
  );
}
