import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@mui/material";
import { useMemo } from "react";
import { Control, FieldValues, useController, useForm } from "react-hook-form";
import { toTitleCase } from "../strings";
import { getInputType, getZodSchema } from "./helpers";
import { DynamicDialogProps } from "./types";

/**
 * ## DynamicDialog
 * A dialog component that takes an object and creates a form from it.
 * If a save function is provided, it will be called when the dialog is submitted.
 *
 * Content is any object. The keys of the object will be used as the
 * form fields.
 *
 * LabelOverride is an array of strings that will be used as the labels for the
 * form fields. If the array is shorter than the number of fields, the remaining
 * fields will be labeled with the key name.
 */
export function DynamicDialog<TData>(props: DynamicDialogProps<TData>) {
  const { content, labelOverride, open, onClose, onSubmit } = props;
  const schema = useMemo(() => getZodSchema(content), [content]);
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          {Object.entries(content).map(([name, value], index) => {
            const label = labelOverride?.[index] || toTitleCase(name);
            return (
              <DialogInput
                {...{
                  control,
                  label,
                  name,
                  initialValue: value,
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
    </Dialog>
  );
}

/** Returns a type of material ui input. */
function DialogInput(props: {
  control: Control<FieldValues, any>;
  label: string;
  name: string;
  initialValue: any;
}) {
  const { control, name, label, initialValue } = props;
  const {
    field,
    formState: { errors },
  } = useController({ name, control, defaultValue: initialValue });

  const inputType = getInputType(initialValue);

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    field.onChange(
      inputType === "number" ? +event.target.value | 0 : event.target.value
    );
  }

  if (inputType === "checkbox") {
    return (
      <FormControlLabel
        control={<Checkbox {...field} defaultChecked={initialValue} />}
        label={label}
      />
    );
  } else if (inputType === "array") {
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
        {initialValue.map((option: string) => (
          <MenuItem key={option} value={option}>
            {toTitleCase(option)}
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
