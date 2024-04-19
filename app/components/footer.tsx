import Container from "./container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-accent-2 border-t">
      <Container>
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-center text-4xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-5xl">
            Made by{" "}
            <Link href="https://github.com/pauloedspinho20">Paulo Pinho</Link>
          </h3>
        </div>
      </Container>
    </footer>
  );
}
