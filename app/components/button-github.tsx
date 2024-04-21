import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function ButtonGithub() {
  return (
    <Link
      href="https://github.com/pauloedspinho20/wordpress-headless-next"
      target="_blank"
      className={`w-full md:w-1/3 ${buttonVariants({
        variant: "outline",
        size: "lg",
      })}`}
    >
      Github
      <GitHubLogoIcon className="ml-2 h-5 w-5" />
    </Link>
  );
}
