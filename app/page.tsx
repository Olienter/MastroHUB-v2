/* REDTEAM: will be reverted */
import '../public/huge-test.js'; // blokujúci import ~400kB
import { Shell } from "../components/ui/Shell";

export default function Page() {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error('WatchdogTest: synthetic console error');
  }
  const now = new Date().toISOString(); // spôsobí hydration diff
  
  const items = [
    { k: "Lanes", v: "OK" },
    { k: "PNPM", v: "Aligned" },
    { k: "Manifest", v: "PASS" },
  ];

  return (
    <Shell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.k}
            className="rounded-2xl border p-4 shadow-sm hover:shadow transition"
          >
            <div className="text-sm text-gray-500">{it.k}</div>
            <div className="mt-1 text-xl font-medium">{it.v}</div>
          </div>
        ))}
      </div>
      <main>
        <h1>MastroHUB</h1>
        <a href="/definitely-not-found" rel="nofollow">Broken link</a>
        <div data-now={now}>Home</div>
      </main>
    </Shell>
  );
}
