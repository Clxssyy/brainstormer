interface SidebarDropdownProps {
  title: string;
  children?: JSX.Element[];
}

const SidebarDropdown = ({ title, children }: SidebarDropdownProps) => {
  return (
    <div className="flex w-full flex-col">
      <h3 className="px-2 text-xl font-semibold">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default SidebarDropdown;
