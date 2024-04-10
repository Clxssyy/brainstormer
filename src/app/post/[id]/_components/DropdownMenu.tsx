"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEllipsis } from "react-icons/fa6";

const DropdownMenu = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="relative">
      <button className="text-neutral-500" onClick={() => setIsOpen(!isOpen)}>
        <FaEllipsis className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="absolute right-0 rounded border border-neutral-800 bg-neutral-900 p-4">
          <button
            className="text-neutral-500 hover:text-amber-400"
            onClick={() => router.push(`/post/${id}/edit`)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
