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
import { FunctionComponent, useMemo } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useForm,
  UseFormStateReturn,
} from "react-hook-form";
import { z } from "zod";
import { toTitleCase } from "../strings";

type Props = {
  content?: object;
  labelOverride?: Array<string | undefined>;
  open: boolean;
  onClose: () => void;
  onSubmit: (content: object) => void;
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
export const DialogConstructor: FunctionComponent<Props> = (props) => {
  const { content, labelOverride, open, onClose, onSubmit } = props;
  if (!content) {
    return <></>;
  }
  const schema = useMemo(() => getZodSchema(content), [content]);
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          {Object.entries(content).map(([keyName, value], index) => {
            const label = labelOverride?.[index] || toTitleCase(keyName);
            return (
              <Controller
                control={control}
                defaultValue={value}
                key={index}
                name={keyName}
                render={({ field, formState }) => (
                  <DialogInput
                    {...{
                      errors: formState.errors,
                      field,
                      keyName,
                      label,
                      value,
                    }}
                  />
                )}
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
  errors: UseFormStateReturn<FieldValues>["errors"];
  field: ControllerRenderProps<FieldValues, string>;
  keyName: string;
  label: string;
  value: any;
}) => {
  const { field, errors, keyName, label, value } = props;
  const inputType = getInputType(value);

  if (inputType === "checkbox") {
    return <FormControlLabel control={<Checkbox {...field} />} label={label} />;
  } else if (inputType === "array") {
    return (
      <TextField
        {...field}
        error={!!errors[keyName]}
        fullWidth
        helperText={errors[keyName]?.message as string}
        id={keyName}
        label={label}
        select
        sx={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
      >
        {value.map((option: string) => (
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
        error={!!errors[keyName]}
        fullWidth
        helperText={errors[keyName]?.message as string}
        id={keyName}
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
const getZodSchema = (data: object) => {
  const schema = z.object(
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
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
