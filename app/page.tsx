import Image from "next/image";

export default function Page() {
  return (
    <main>
      <h1>MastroHUB</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" placeholder="Email" />
      </form>
      <Image
        src="/logo.png"
        alt="MastroHUB Logo"
        width={200}
        height={100}
        priority
      />
      <div>Home</div>
    </main>
  );
}
