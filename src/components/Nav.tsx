import Link from "next/link";

const links = [
  ["#path", "The path"],
  ["#services", "Support"],
  ["#packages", "Beginnings"],
  ["#story", "Our story"],
  ["#enroll", "Orientation"],
];

export default function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="wordmark">
        Doctor&apos;s Credit
      </Link>
      <nav>
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
        <Link href="/account" className="nav-file">
          Your file
        </Link>
      </nav>
    </header>
  );
}
