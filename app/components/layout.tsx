import { ReactNode } from "react";
import Meta from "./meta";

interface Props {
  preview: boolean;
  children: ReactNode;
}

export default function Layout({ preview, children }: Props) {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
    </>
  );
}
