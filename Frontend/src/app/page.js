import Image from "next/image";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="flex flex-col items-center justify-center space-y-10">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 text-transparent bg-clip-text">Hello World</h1>
              <h2 className="text-8xl font-bold">I am <span className="bg-gradient-to-r from-blue-500 to-blue-50 text-transparent bg-clip-text select-none">Alex</span>!</h2>
          </div>
      </main>
  );
}
