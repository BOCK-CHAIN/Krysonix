import Link from "next/link";
import Image from "next/image";
import { privacyPolicy } from "~/Components/legacydetails";
import LegacyMapping from "~/Components/legacyMapping";

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-[#0D0D0D] flex justify-center items-center min-h-screen relative">
            <Link href="/" className="absolute top-4 left-4">
                <Image 
                    src="/logo.svg" 
                    alt="Home Logo" 
                    width={120} 
                    height={40} 
                    className="cursor-pointer"
                />
            </Link>

            <div className="bg-[#0D0D0D] text-gray-300 min-h-screen w-[80%] px-1 md:px-6 py-8">
                <h1 className="text-4xl font-bold mb-6 text-center text-white">
                    Privacy Policy
                </h1>
                <p className="text-sm text-gray-400 text-center mb-8">
                    <strong>Last Updated:</strong> {privacyPolicy.lastUpdated}
                </p>
                {
                    privacyPolicy.content.map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                    ))
                }
                <LegacyMapping legacy={privacyPolicy} />
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
