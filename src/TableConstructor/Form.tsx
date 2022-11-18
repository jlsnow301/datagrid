import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { Control, useController, useForm } from "react-hook-form";
import { ConstructorOptions, DynamicFormProps, RowData } from "./types";
import { toTitleCase } from "../strings";
import {
  getInitialValue,
  getSelections,
  getZodSchema,
  hasOption,
} from "./helpers";

/**
 * ## DynamicForm
 * Generates a form based on the content and options provided. The form will
 * be pre-populated with the data from the row, or use a template.
 */
export function DynamicForm(props: DynamicFormProps) {
  const { content, editing, onClose, onDelete, onSubmit, options } = props;
  const schema = useMemo(() => getZodSchema(content, options), [content]);
  const {
    formState: { dirtyFields, isDirty },
    control,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const toDisplay =
    (options &&
      Object.keys(options).filter(
        (key) => !hasOption(key, options, ["hidden", "noForm"])
      )) ||
    Object.keys(content);

  const isSmallList = toDisplay.length < 12;

  /** Copies the edited data over onto the original object */
  function onSubmitClick(data: RowData) {
    if (Object.keys(dirtyFields).every((key) => data[key] === content[key])) {
      onClose();
      return;
    }
    onSubmit({
      ...content,
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      ),
    });
  }

  /** If a delete function exists and the ID is valid, call it */
  function onDeleteClick() {
    const value = Object.values(content)[0];
    if (onDelete && typeof value === "string") {
      onDelete(value);
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitClick)}>
      <DialogContent
        sx={{
          maxHeight: "35rem",
          border: "thin solid lightgray",
          overflowX: "hidden",
        }}
      >
        {toDisplay.map((key, index) => (
          <DialogInput
            {...{
              control,
              options,
              fullWidth: isSmallList,
              label: (options && options[key]?.label) || toTitleCase(key),
              name: key,
              initialValue: getInitialValue(content[key], index === 0),
            }}
            key={index}
          />
        ))}
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <div>
          {content.Creator && (
            <Typography
              color="gray"
              sx={{ marginLeft: "1rem" }}
              variant="caption"
            >
              Created by {content.Creator}
            </Typography>
          )}
        </div>
        <div>
          <Button onClick={onClose} sx={{ marginRight: "0.5rem" }}>
            Cancel
          </Button>
          {editing && !!onDelete && (
            <Button
              color="primary"
              variant="contained"
              onClick={onDeleteClick}
              sx={{ marginRight: "0.5rem" }}
            >
              Delete
            </Button>
          )}
          <Button
            color="primary"
            disabled={!isDirty}
            type="submit"
            variant="contained"
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </form>
  );
}

/** Returns a type of material ui input. */
function DialogInput(props: {
  control: Control<RowData, any>;
  options?: ConstructorOptions;
  fullWidth?: boolean;
  label: string;
  name: string;
  initialValue: string | number | boolean;
}) {
  const { control, options, fullWidth, initialValue, label, name } = props;

  const multilineProps = hasOption(name, options, "multiline")
    ? {
        rows: 3,
        multiline: true,
      }
    : {};

  const selections = getSelections(name, options);

  /** The initial value must be something viewable. Reverts to "". */
  const validDefault = useMemo(() => {
    switch (true) {
      case initialValue === -1:
        return "";
      case initialValue === null:
        return;
      case selections.length > 0:
        if (!selections.includes(initialValue as never)) {
          return "";
        }
        return initialValue;
      default:
        return initialValue;
    }
  }, [initialValue]);

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
  } else if (selections instanceof Array && selections.length > 0) {
    return (
      <TextField
        {...field}
        error={!!errors[name]}
        fullWidth={fullWidth}
        helperText={errors[name]?.message as string}
        id={name}
        label={label}
        select
        sx={{
          margin: "0.5rem 0.5rem 0.5rem 0",
          width: !fullWidth ? "25rem" : "100%",
        }}
      >
        {hasOption(name, options, "optional") && (
          <MenuItem value="">None</MenuItem>
        )}
        {selections?.map((option) => (
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
        {...multilineProps}
        error={!!errors[name]}
        fullWidth={fullWidth}
        helperText={errors[name]?.message as string}
        id={name}
        label={label}
        onChange={changeHandler}
        sx={{
          margin: "0.5rem 0.5rem 0.5rem 0",
          width: !fullWidth ? "25rem" : "100%",
        }}
        variant="outlined"
      />
    );
  }
}
