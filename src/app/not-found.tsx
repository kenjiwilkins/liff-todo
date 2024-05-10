/**
 * v0 by Vercel.
 * @see https://v0.dev/t/obQyiW6YhRQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
        <Image
          alt="404 Illustration"
          className="max-w-[600px] sm:max-w-[800px]"
          height="200"
          src="/icon-blobmoji-melt.svg"
          width="300"
        />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Congrats. You broke me.
          </h1>
          <p className="max-w-[500px] text-gray-500 md:text-lg">
            The page you are looking for does not exist. But do not worry, you
            can always go back home and start fresh.
          </p>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
            href="/"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
