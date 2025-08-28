import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Welcome to Polly</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create polls, share with friends, and gather opinions easily.
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2 max-w-lg mx-auto mb-12">
          <Link href="/polls">
            <Button className="w-full py-6 text-lg" size="lg">
              View Polls
            </Button>
          </Link>
          <Link href="/polls/create">
            <Button className="w-full py-6 text-lg" variant="outline" size="lg">
              Create Poll
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Create</h2>
            <p className="text-gray-600">Design custom polls with multiple options in seconds</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Share</h2>
            <p className="text-gray-600">Share polls with friends, colleagues, or the public</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Analyze</h2>
            <p className="text-gray-600">View real-time results with beautiful visualizations</p>
          </div>
        </div>
      </main>
      <footer className="mt-12 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
