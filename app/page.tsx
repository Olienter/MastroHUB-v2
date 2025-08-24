/* REDTEAM: will be reverted */
import '../public/huge-test.js'; // ❌ blokujúci import ~400kB
export default function Page() {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error('WatchdogTest: synthetic console error'); // ❌ console error
  }
  const now = new Date().toISOString(); // ❌ hydration diff
  return (
    <main>
      <h1>MastroHUB</h1>
      <h1>Duplicate Heading</h1> {/* ❌ a11y: duplicitné H1 */}
      <form>
        <input id="email" placeholder="Email" /> {/* ❌ bez <label>/aria-label */}
      </form>
      <img src="/logo.png" /> {/* ❌ bez alt */}
      <a href="/definitely-not-found" rel="nofollow">Broken link</a> {/* ❌ 404 */}
      <div data-now={now}>Home</div>
    </main>
  );
}
