import Link from "next/link";
import Image from "next/image";

const Logo = ({
  withText = false,
  logoSize,
}: {
  withText?: boolean;
  logoSize?: number;
}) => {
  return (
    <Link
      href="/"
      className="flex items-center text-sm mr-4 text-black px-2 py-1 z-20"
    >
      <div className="flex items-center">
        <Image
          src="/betterleetcode.svg"
          alt="logo"
          width={logoSize || 30}
          height={logoSize || 30}
        />
        {withText && (
          <span className="font-bold text-orange-200 ml-2 text-lg leading-none">
            BetterLeetCode
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
