import Link from "next/link";
import { buttonVariants } from "../ui/button";

import Animation from "../animation";
import ButtonGithub from "../button-github";

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <div className="position-absolute">
        <Animation className="lg:ml-40" />
      </div>

      <section className="position-absolute container grid place-items-center py-20 md:grid-cols-2 md:py-32">
        <div className="space-y-6 px-5 text-center sm:px-10 md:text-start lg:px-20">
          <main className="text-5xl font-bold">
            <h1 className="text-primary">Wordpress + Next.js</h1>
            <h4 className="">Tailwind CSS + shadcn/ui</h4>
            <h6 className="">NextAuth.js + Zustand + Three.js</h6>
          </main>

          <p className=":w-10/12  mx-auto text-muted-foreground lg:mx-0">
            Wordpress ACF + Custom Post Types + REST and GraphQL API Check the
            dashboard to manage Expenses, a Next.js custom post type with custom
            fields
          </p>

          <div className="space-y-4 md:space-x-4 md:space-y-0">
            <Link
              href="/dashboard"
              className={`w-full md:w-1/3 ${buttonVariants({
                size: "lg",
              })}`}
            >
              Dashboard
            </Link>

            <ButtonGithub />
          </div>
        </div>
        {/* Shadow effect */}
        <div className="shadow"></div>
      </section>
    </div>
  );
}
