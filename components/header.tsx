import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-black text-white">
      <div className="container-shell flex items-center justify-between py-5">
        <Link href="/" className="text-xl font-bold">
          Resonance Dubbing Lab
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#features" className="hover:text-white/70">
            Features
          </a>

          <a href="#pricing" className="hover:text-white/70">
            Pricing
          </a>

          <a href="#use-cases" className="hover:text-white/70">
            Use cases
          </a>

          <Link href="/dashboard" className="hover:text-white/70">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}