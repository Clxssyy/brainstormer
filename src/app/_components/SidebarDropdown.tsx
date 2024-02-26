interface SidebarDropdownProps {
  title: string;
  children?: JSX.Element[];
}

const SidebarDropdown = ({ title, children }: SidebarDropdownProps) => {
  return (
    <div className="flex w-full flex-col gap-2 p-2 pr-0">
      <div>
        <h3>{title}</h3>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default SidebarDropdown;
