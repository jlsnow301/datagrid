import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMemo } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { toTitleCase } from "../strings";
import { getZodSchema } from "./helpers";
import { DynamicFormProps, RowData } from "./types";

/**
 * ## DynamicForm
 * Ideally used in conjuction with DynamicTable. This component will take a row
 * of data and create a form from it. The form will be pre-populated with the
 * data from the row.
 */
export function DynamicForm(props: DynamicFormProps) {
  const {
    content,
    labelOverride,
    onClose,
    onSubmit,
    optionalKeys = [],
    selections,
  } = props;
  const schema = useMemo(() => getZodSchema(content, optionalKeys), [content]);
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        {Object.entries(content)
          .slice(1)
          .map(([name, value], index) => {
            const label = labelOverride?.[index] || toTitleCase(name);
            return (
              <DialogInput
                {...{
                  control,
                  label,
                  name,
                  initialValue: value,
                  selections,
                }}
                key={index}
              />
            );
          })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" type="submit" variant="contained">
          Save
        </Button>
      </DialogActions>
    </form>
  );
}

/** Returns a type of material ui input. */
function DialogInput(props: {
  control: Control<RowData, any>;
  label: string;
  name: string;
  initialValue: string | number | boolean;
  selections?: Record<string, string[] | number[]>;
}) {
  const { control, initialValue, label, name, selections } = props;

  const validDefault = useMemo(() => {
    switch (true) {
      case initialValue === -1:
        return "";
      case selections && selections[name] !== undefined:
        if (typeof initialValue !== typeof selections![name][0]) {
          console.warn(
            "Current value is not the same type as selections. This might make it impossible to select."
          );
          return "";
        }
        if (!selections![name].includes(initialValue as never)) {
          return "";
        }
      default:
        return initialValue;
    }
  }, [initialValue, selections]);

  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
    defaultValue: validDefault,
  });

  /** Blocks any non-numbers from entering a number input */
  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (typeof initialValue === "number") {
      if (!isNaN(Number(value))) {
        field.onChange(Number(value));
      }
      return;
    }
    field.onChange(value);
  }

  if (typeof initialValue === "boolean") {
    return (
      <FormControlLabel
        control={<Checkbox {...field} defaultChecked={initialValue} />}
        label={label}
      />
    );
  } else if (selections && selections[name]) {
    return (
      <TextField
        {...field}
        error={!!errors[name]}
        fullWidth
        helperText={errors[name]?.message as string}
        id={name}
        label={label}
        select
        sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
      >
        {selections[name].map((option: string | number) => (
          <MenuItem key={option} value={option}>
            {typeof option === "string" ? toTitleCase(option) : option}
          </MenuItem>
        ))}
      </TextField>
    );
  } else {
    return (
      <TextField
        {...field}
        error={!!errors[name]}
        fullWidth
        helperText={errors[name]?.message as string}
        id={name}
        label={label}
        onChange={changeHandler}
        sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
        variant="outlined"
      />
    );
  }
}
