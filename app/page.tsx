import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg text-fg p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-step-4 font-bold text-brand mb-8">MastroHUB</h1>

        <form className="space-y-4 mb-8">
          <div>
            <label
              htmlFor="email"
              className="block text-step-1 font-medium text-fg mb-2"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-border rounded-radius-2 bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent"
            />
          </div>
        </form>

        {/* TODO: Add logo.png to public/ directory when available */}
        {/* <div className="mb-8">
          <Image
            src="/logo.png"
            alt="MastroHUB Logo"
            width={200}
            height={100}
            priority
            className="rounded-radius-2 shadow-2"
          />
        </div> */}

        <div className="text-step-2 text-fg-subtle">Home</div>
      </div>
    </main>
  );
}
