import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const { data: session, status } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src="/placeholder-user.png"
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {status === "authenticated" ? session.user.name : "My Account"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {status === "unauthenticated" && (
          <Link href="/auth/login">
            {" "}
            <DropdownMenuItem>Login</DropdownMenuItem>
          </Link>
        )}
        {status === "authenticated" && (
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
