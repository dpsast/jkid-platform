import { TextField, type TextFieldProps } from '@mui/material';
import type React from 'react';
import { useState } from 'react';

export type ValidationResult =
  | {
      isValid: true;
    }
  | {
      isValid: false;
      hint: string;
    };

function ValidatorTextField({
  validator,
  frequency,
  setValid,
  onValidationPass,
  defaultHelperText,
  ...others
}: TextFieldProps & {
  validator: (input: string) => ValidationResult | Promise<ValidationResult>;
  frequency?: 'onChange' | 'onBlur';
  setValid: React.Dispatch<boolean>;
  onValidationPass?: (input: string) => void;
  defaultHelperText?: string;
}) {
  const [lastInput, setLastInput] = useState('');
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const [color, setColor] = useState<'primary' | 'error' | 'secondary' | 'info' | 'success' | 'warning'>('primary');
  const [helperText, setHelperText] = useState(defaultHelperText ?? '');

  async function handleValidate(
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    const input = event.target.value;
    if (lastInput === input) return;
    const result = await validator(input);
    if (result.isValid) {
      setValid(true);
      setError(false);
      setColor('success');
      setFocused(true);
      setHelperText(defaultHelperText ?? '');

      onValidationPass?.(input);
    } else {
      setValid(false);
      setError(true);
      setHelperText(result.hint);
    }
    setLastInput(input);
  }

  return (
    <TextField
      error={error}
      color={color}
      focused={focused}
      {...(frequency === 'onChange'
        ? {
            onChange: handleValidate,
          }
        : {
            onBlur: handleValidate,
          })}
      helperText={helperText}
      {...others}
    />
  );
}

export default ValidatorTextField;
