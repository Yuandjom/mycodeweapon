import Link from "next/link";
import React from "react";
import { footerLegals, footerPages, footerAuths } from "@/constants/footer";
import { GITHUB_URL } from "@/constants/global";
import Logo from "@/components/utils/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border px-8 py-20 bg-background w-full relative overflow-hidden">
      <div className="mx-auto text-sm text-muted-foreground flex sm:flex-row flex-col justify-between items-start md:px-8">
        <div>
          <div className="mr-0 md:mr-2 md:flex md:justify-start md:items-center mb-2">
            <Link
              href="/"
              className="font-normal flex space-x-2 justify-start items-center text-sm text-foreground px-2 py-1 z-20"
            >
              <Logo />
              <span className="font-medium text-foreground">
                My Code Weapon
              </span>
            </Link>
          </div>

          <div className="mt-2">
            No copyrights. 100% open sourced on{" "}
            <Link
              className="underline hover:text-blue-500 hover:scale-150"
              href={`${GITHUB_URL}/issues`}
            >
              GitHub
            </Link>
            !
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col w-full">
            <p className="text-foreground font-bold">Pages</p>
            <ul className="text-muted-foreground list-none space-y-4">
              {footerPages.map((link, idx) => (
                <li key={"pages" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-foreground"
                    href={link.href}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="text-foreground font-bold">Legal</p>
            <ul className="text-muted-foreground list-none space-y-4">
              {footerLegals.map((link, idx) => (
                <li key={"legal" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-foreground"
                    href={link.href}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="text-foreground font-bold">Get Started</p>
            <ul className="text-muted-foreground list-none space-y-4">
              {footerAuths.map((link, idx) => (
                <li key={"auth" + idx} className="list-none">
                  <Link
                    className="transition-colors hover:text-foreground"
                    href={link.href}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
