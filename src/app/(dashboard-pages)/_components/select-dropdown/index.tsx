import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface SelectDropdownProperties {
  options: Option[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  triggerClassName?: string;
}

export const SelectDropdown = ({
  options,
  placeholder = "Select an option",
  value,
  onValueChange,

  triggerClassName = "h-[48px] w-[180px]",
}: SelectDropdownProperties) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
