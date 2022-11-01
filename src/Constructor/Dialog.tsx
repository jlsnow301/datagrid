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
import { z } from "zod";
import { toTitleCase } from "../strings";
import { PageConstructorProps } from "./Page";

type DialogProps<TData> = Pick<PageConstructorProps<TData>, "labelOverride"> & {
  content: TData;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FieldValues) => void;
};

/**
 * ## DialogConstructor
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
export const DialogConstructor = <TData extends Record<string, any>>(
  props: DialogProps<TData>
) => {
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
};

/** Returns a type of material ui input. */
const DialogInput = (props: {
  control: Control<FieldValues, any>;
  label: string;
  name: string;
  initialValue: any;
}) => {
  const { control, name, label, initialValue } = props;
  const {
    field,
    formState: { errors },
  } = useController({ name, control, defaultValue: initialValue });

  const inputType = getInputType(initialValue);

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
        sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
        variant="outlined"
      />
    );
  }
};

/** Checks which input type to use based on value. */
const getInputType = (value: any) => {
  if (value instanceof Array) {
    return "array";
  } else if (typeof value === "boolean") {
    return "checkbox";
  } else {
    return "text";
  }
};

/** Creates a Zod schema from an object. */
const getZodSchema = (content: Record<string, any>) => {
  if (Object.entries(content)?.length === 0) return z.object({});
  const schema = z.object(
    Object.fromEntries(
      Object.entries(content).map(([key, value]) => {
        if (typeof value === "number") {
          return [key, z.number()];
        } else if (typeof value === "string") {
          return [key, z.string()];
        } else if (typeof value === "boolean") {
          return [key, z.boolean()];
        } else {
          return [key, z.any()];
        }
      })
    )
  );
  return schema;
};
