import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { id } from "date-fns/locale";
import React, { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import { GoCalendar } from "react-icons/go";

import "react-datepicker/dist/react-datepicker.css";

/**
 * Customizable date input component
 * @date 07/08/2023 - 10:48:42
 *
 * @param {{
		value?: string;
		placeholder?: string;
		fontSize: string;
		onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
		onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	}} {
		value,
		fontSize,
		onClick,
		onChange,
		placeholder,
	}
 * @param {React.Ref<HTMLInputElement>} ref
 * @returns {void; onChange?: (event: any) => void; }, ref: any): any; displayName: string; }}
 */
const customDateInput = (
  {
    value,
    fontSize,
    onClick,
    onChange,
    placeholder,
  }: {
    value?: string;
    placeholder?: string;
    fontSize: string;
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  },
  ref: React.Ref<HTMLInputElement>
) => (
  <InputGroup>
    <Input
      w="100%"
      background="white"
      fontSize={["xs", fontSize]}
      value={value}
      ref={ref}
      onClick={onClick}
      onChange={onChange}
      placeholder={placeholder}
    />
    <InputLeftElement>
      <Icon
        as={GoCalendar}
        color="gray.500"
        boxSize={4}
        display="flex"
        w="full"
      />
    </InputLeftElement>
  </InputGroup>
);

customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

interface DatePickerProps {
  isClearable?: boolean;
  onChange: (
    date: Date | null,
    event?: React.SyntheticEvent<any> | undefined
  ) => void;
  selectedDate: Date | null | undefined;
  showPopperArrow?: boolean;
  showTime?: boolean;
  name: string;
  dateFormat?: string;
  fontSize?: string;
  placeholder?: string;
}

/**
 * customizable date picker component with React Datepicker
 * @date 07/08/2023 - 10:48:21
 *
 * @param {DatePickerProps} {
	showTime = false,
	dateFormat = 'd MMMM yyyy',
	selectedDate,
	fontSize = 'sm',
	name,
	placeholder,
	onChange,
	...props
}
 * @returns {*}
 */
const DatePicker = ({
  showTime = false,
  dateFormat = "d MMMM yyyy",
  selectedDate,
  fontSize = "sm",
  name,
  placeholder,
  onChange,
  ...props
}: DatePickerProps) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={(date, event) => onChange(date, event)}
      customInput={<CustomInput fontSize={fontSize} />}
      showTimeSelect={showTime}
      locale={id}
      dateFormat={dateFormat}
      placeholderText={placeholder}
      name={name}
      {...props}
    />
  );
};

export default DatePicker;
