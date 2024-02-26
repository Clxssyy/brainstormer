"use client";

import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
import SidebarDropdown from "./SidebarDropdown";
import Link from "next/link";
import { useState } from "react";
import { FaBrain, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const [hidden, setHidden] = useState<boolean>(false);

  return (
    <nav
      className={`${hidden ? "w-14" : "w-1/6"} custom-scroll flex flex-col place-items-center overflow-x-hidden  overflow-y-scroll text-nowrap bg-neutral-900 text-white shadow-lg`}
    >
      <div
        className={`${hidden ? "" : "flex w-full justify-between"} p-2 pr-0`}
      >
        {hidden ? (
          <button onClick={() => setHidden(!hidden)}>
            <TbArrowBarRight className="h-6 w-6" />
          </button>
        ) : (
          <>
            <h1 className="text-2xl font-bold">For You</h1>
            <button onClick={() => setHidden(!hidden)}>
              <TbArrowBarLeft className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {hidden ? (
        <div className="flex flex-col gap-2 p-2 pr-0">
          <FaBrain className="h-6 w-6" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-6 bg-amber-400"></div>
            <div className="h-6 w-6 bg-amber-400"></div>
            <div className="h-6 w-6 bg-amber-400"></div>
          </div>
        </div>
      ) : (
        <SidebarDropdown title="Brainstorms">
          <div className="flex place-items-center gap-1">
            <div className="h-6 w-6 bg-amber-400"></div>
            <Link href="" className="text-sm">
              Brainstorm 1
            </Link>
          </div>
          <div className="flex place-items-center gap-1">
            <div className="h-6 w-6 bg-amber-400"></div>
            <Link href="" className="text-sm">
              Brainstorm 1
            </Link>
          </div>
          <div className="flex place-items-center gap-1">
            <div className="h-6 w-6 bg-amber-400"></div>
            <Link href="" className="text-sm">
              Brainstorm 1
            </Link>
          </div>
        </SidebarDropdown>
      )}
      {hidden ? (
        <div className="flex flex-col gap-2 p-2 pr-0">
          <FaUser className="h-6 w-6" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-6 rounded-full bg-amber-400"></div>
            <div className="h-6 w-6 rounded-full bg-amber-400"></div>
            <div className="h-6 w-6 rounded-full bg-amber-400"></div>
          </div>
        </div>
      ) : (
        <SidebarDropdown title="Following"></SidebarDropdown>
      )}
    </nav>
  );
};

export default Sidebar;
