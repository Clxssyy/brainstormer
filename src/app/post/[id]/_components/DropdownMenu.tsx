"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaEllipsis } from "react-icons/fa6";

const DropdownMenu = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const ref = useRef(null);

  const handleClickOutside = (event: any) => {
    if (
      ref.current &&
      !(ref.current as unknown as HTMLElement).contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative" ref={ref}>
      <button className="text-neutral-500" onClick={() => setIsOpen(!isOpen)}>
        <FaEllipsis className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="absolute right-0 rounded border-2 border-neutral-800 bg-neutral-900 p-4">
          <button
            className="text-neutral-500 hover:text-amber-400"
            onClick={() => {
              router.push(`/post/${id}/edit`);
              setIsOpen(false);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
