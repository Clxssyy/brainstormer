"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaUser, FaBrain, FaHeart } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { FaMagnifyingGlass } from "react-icons/fa6";

const ProfileDropdown = ({ session }: { session: Session }) => {
  const [hidden, setHidden] = useState<boolean>(true);

  const ref = useRef(null);

  const handleClickOutside = (event: any) => {
    if (
      ref.current &&
      !(ref.current as unknown as HTMLElement).contains(event.target)
    ) {
      setHidden(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative flex justify-center" ref={ref}>
      <button
        className="gap-2 rounded-full ring-2 ring-amber-400"
        onClick={() => setHidden(!hidden)}
      >
        <Image
          src={session.user.image ?? "/default-avatar.png"}
          alt={session.user.name ?? "User"}
          width={128}
          height={128}
          className="h-8 w-8 rounded-full"
        />
      </button>
      <div
        className={`${hidden ? "hidden" : ""} absolute right-0 top-10 z-10 flex w-48 flex-col divide-y divide-neutral-800 rounded-lg border-2 border-neutral-800 bg-neutral-900`}
      >
        <Link
          href={`/user/${session.user.name}`}
          onClick={() => setHidden(true)}
        >
          <div className="flex place-items-center gap-2 p-2">
            <FaUser />
            <h4>Profile</h4>
          </div>
        </Link>
        <Link
          href={"/create"}
          className="md:hidden"
          onClick={() => setHidden(true)}
        >
          <div className="flex place-items-center gap-2 p-2">
            <FaBrain />
            <h4>Create</h4>
          </div>
        </Link>
        <Link
          href={"/explore"}
          className="md:hidden"
          onClick={() => setHidden(true)}
        >
          <div className="flex place-items-center gap-2 p-2">
            <FaMagnifyingGlass />
            <h4>Explore</h4>
          </div>
        </Link>
        <Link
          href={"/following"}
          className="md:hidden"
          onClick={() => setHidden(true)}
        >
          <div className="flex place-items-center gap-2 p-2">
            <FaHeart />
            <h4>Following</h4>
          </div>
        </Link>
        <Link href="/api/auth/signout" onClick={() => setHidden(true)}>
          <div className="flex place-items-center gap-2 p-2">
            <TbLogout />
            <h4>Logout</h4>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileDropdown;
