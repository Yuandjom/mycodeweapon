import Link from "next/link";
import Image from "next/image";

const Logo = ({withText=false, logoSize} : {withText?: boolean, logoSize?: number}) => {
    return (
      <Link
        href="/"
        className="font-normal flex space-x-2 items-center text-sm mr-4 text-black px-2 py-1 relative z-20"
      >
        <Image src="/mycodeweaponlogo.svg" alt="logo" width={logoSize || 30} height={logoSize || 30} />
        {withText && <span className="font-medium text-black dark:text-white">My Code Weapon</span>}
      </Link>
    );
};

export default Logo
