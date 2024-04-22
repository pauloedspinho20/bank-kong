import Link from "next/link";

export default function Footer() {
  return (
    <footer id="footer">
      <section className="container pb-14 text-center">
        <h3>
          &copy; 2024 - Made by{" "}
          <Link
            target="_blank"
            href="https://github.com/pauloedspinho20"
            className="border-primary text-primary transition-all hover:border-b-2"
          >
            Paulo Pinho
          </Link>
        </h3>
      </section>
    </footer>
  );
}
