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
      className="font-normal flex space-x-2 justify-center items-center text-sm mr-4 text-black px-2 py-1 relative z-20"
    >
      <Image
        src="/betterleetcode.svg"
        alt="logo"
        width={logoSize || 30}
        height={logoSize || 30}
      />
      <div className="flex justify-start items-center">
        {withText && (
          <span className="font-bold text-orange-200">Better LeetCode</span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
