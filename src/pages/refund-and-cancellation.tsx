import Image from "next/image";
import Link from "next/link";
import { refundAndCancellation } from "~/Components/legacydetails";
import LegacyMapping from "~/Components/legacyMapping";

const RefundAndCancellationPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
      <Link href="/" className="absolute left-4 top-4">
        <Image
          src="/logo.svg"
          alt="Home Logo"
          width={120}
          height={40}
          className="cursor-pointer"
        />
      </Link>
      <div className="mt-4 min-h-screen w-[80%] bg-[#0D0D0D] px-1 py-8 text-gray-300 md:px-6">
        <h1 className="mb-6 text-center text-4xl font-bold text-white">
          Refund and Cancellation Policy
        </h1>
        <p className="mb-8 text-center text-sm text-gray-400">
          <strong>Last Updated:</strong> {refundAndCancellation.lastUpdated}
        </p>
        {refundAndCancellation.content.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
        <LegacyMapping legacy={refundAndCancellation} />
      </div>
    </div>
  );
};

export default RefundAndCancellationPage;
