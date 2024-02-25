"use client";

import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";

const ProfileDropdown = ({ session }: { session: Session }) => {
  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <div className="relative flex justify-center">
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
        className={`${hidden ? "hidden" : ""} absolute right-0 top-10 flex flex-col divide-y divide-neutral-800 rounded-lg bg-neutral-900`}
      >
        <Link href="/profile">
          <div className="flex place-items-center gap-2 p-2">
            <FaUser />
            <h4>Profile</h4>
          </div>
        </Link>
        <Link href="/api/auth/signout">
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
