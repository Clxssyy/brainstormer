import Link from "next/link";

const NotFound = () => {
  return (
    <div className="error-bg flex grow flex-col place-items-center justify-center gap-2">
      <p className="text-4xl font-bold text-white">Not Found!</p>
      <Link
        href="/"
        className="text-sm text-amber-400 underline hover:text-amber-500"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
