"use client";

import { useState } from "react";
import { BiSolidChevronDown } from "react-icons/bi";

interface SidebarDropdownProps {
  title: string;
  children?: JSX.Element[];
}

const SidebarDropdown = ({ title, children }: SidebarDropdownProps) => {
  const [hidden, setHidden] = useState<boolean>(false);

  return (
    <div className="border-b border-neutral-800">
      <div className="flex place-items-center justify-between p-2 shadow-md">
        <h3>{title}</h3>
        <button onClick={() => setHidden(!hidden)}>
          <BiSolidChevronDown />
        </button>
      </div>
      {hidden ? null : <div className="flex flex-col">{children}</div>}
    </div>
  );
};

export default SidebarDropdown;
