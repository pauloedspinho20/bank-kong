import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ComboboxOptionProps {
  value: string;
  label: string;
}

export interface ComboboxProps {
  className?: string;
  value?: string;
  placeholder?: string;
  selectedValue?: (value: string) => void;
  name?: string;
  options?: ComboboxOptionProps[] | undefined;
}

export function Combobox({
  className,
  value = "",
  placeholder = "Select...",
  selectedValue,
  name,
  options,
}: ComboboxProps) {
  const handleOptionClick = (optionValue: string) => {
    if (selectedValue) {
      selectedValue(optionValue);
    }
  };

  return (
    <div className={className}>
      <Select name={name} onValueChange={selectedValue} defaultValue={value}>
        <SelectTrigger className="min-w-[200px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
