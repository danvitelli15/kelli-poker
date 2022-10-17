import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/account/login">Login</Link>
      <Link href="/account/create">Create Account</Link>
    </div>
  );
}
