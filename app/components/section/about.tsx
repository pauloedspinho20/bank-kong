import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function About() {
  return (
    <section id="about" className="container py-10">
      <div className="rounded-lg border bg-muted/50 py-12">
        <div className="flex flex-col-reverse gap-8 px-6 md:flex-row md:gap-12">
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
                  About{" "}
                </span>
                Paulo Pinho
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                I'm Paulo Pinho, a Portuguese Frontend Web Developer (Fullstack
                experience) with expertise in React.js, Next.js, Node.js, NFT
                marketplaces, Smart Contracts and Web3. I've gained extensive
                experience in developing user-friendly and responsive web
                applications using the industry standard frameworks. My
                proficiency extends to Wordpress, eCommerce, Blockchain, CSS
                methodologies and testing.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col items-center justify-center">
        <Link
          href="/dashboard"
          className={`h-16 w-full text-xl md:w-1/3 ${buttonVariants({
            variant: "secondary",
            size: "xl",
          })}`}
        >
          Go to Dashboard
        </Link>
      </div>
    </section>
  );
}
