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
import { getZodSchema } from "./helpers";
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
  const {
    content,
    labelOverride,
    onClose,
    onSubmit,
    open,
    optionalKeys = [],
    selections,
  } = props;
  const schema = useMemo(() => getZodSchema(content, optionalKeys), [content]);
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
    </Dialog>
  );
}

/** Returns a type of material ui input. */
function DialogInput(props: {
  control: Control<FieldValues, any>;
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
        sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
        variant="outlined"
      />
    );
  }
}
