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

import {
  ConstructorOption,
  ConstructorOptions,
  DynamicFormProps,
  RowData,
} from "./types";
import { isNullOrUndefined } from "./isNullOrUndefined";
import { toTitleCase } from "./strings";
import { getOption, getZodSchema, hasOption } from "./helpers";

/**
 * ## DynamicForm
 * Generates a form based on the content and options provided. The form will
 * be pre-populated with the data from the row, or use a template.
 */
export function DynamicForm({
  content,
  editing,
  onClose,
  onDelete,
  onSubmit,
  options,
}: DynamicFormProps) {
  const schema = useMemo(() => getZodSchema(content, options), [content]);
  const {
    control,
    formState: { dirtyFields, isDirty },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const toDisplay: string[] =
    (options &&
      [...options]
        .filter(([_, value]) => !value.hidden && !value.noForm)
        .map(([key]) => key)) ||
    Object.keys(content);

  const isSmallList = toDisplay.length < 12;

  /** If a delete function exists and the ID is valid, call it */
  function handleDeleteClick() {
    const value = Object.values(content)[0];
    if (onDelete && typeof value === "string") {
      onDelete(value);
      onClose();
    }
  }

  /** Copies the edited data over onto the original object */
  function handleSubmitClick(data: RowData) {
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

  return (
    <form onSubmit={handleSubmit(handleSubmitClick)}>
      <DialogContent
        sx={{
          border: "thin solid lightgray",
          maxHeight: "35rem",
          overflowX: "hidden",
        }}
      >
        {toDisplay.map((key, index) => (
          <DialogInput
            {...{
              control,
              fullWidth: isSmallList,
              initialValue: isNullOrUndefined(content[key])
                ? ""
                : (content[key] as string | number | boolean),
              label:
                (getOption(key, options, "label") as string) ||
                toTitleCase(key),
              name: key,
              options,
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
              onClick={handleDeleteClick}
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
  const { control, fullWidth, initialValue, label, name, options } = props;

  const fieldDisabled =
    hasOption(name, options, ["disabled"]) &&
    (getOption(name, options, "disabled") as boolean);

  const isOptional = hasOption(name, options, ["optional"]);

  const multilineProps = hasOption(name, options, "multiline")
    ? {
        multiline: true,
        rows: 3,
      }
    : {};

  let presetValue = "";
  if (hasOption(name, options, "value")) {
    const newValue = getOption(
      name,
      options,
      "value"
    ) as ConstructorOption["value"];
    if (typeof newValue === "function") {
      presetValue = newValue(String(initialValue));
    } else if (typeof newValue === "string") {
      presetValue = newValue;
    }
  }

  let selections: string[] = [];
  if (hasOption(name, options, "selections")) {
    const newSelections = getOption(
      name,
      options,
      "selections"
    ) as ConstructorOption["selections"];
    if (typeof newSelections === "function") {
      selections = newSelections(String(initialValue));
    } else if (newSelections instanceof Array) {
      selections = newSelections;
    }
  }

  /** The initial value must be something viewable. Reverts to "". */
  const validDefault = useMemo(() => {
    switch (true) {
      case initialValue === -1:
        return "";
      case initialValue === null:
        return;
      case selections.length > 0:
        if (presetValue) return presetValue;
        if (!selections?.includes(initialValue as never)) {
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
    control,
    defaultValue: validDefault,
    name,
  });

  /** Blocks any non-numbers from entering a number input */
  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (hasOption(name, options, "number")) {
      if (!isNaN(Number(value))) {
        field.onChange(Number(value));
      }
      return;
    }
    field.onChange(value);
  }

  /** In case the user has made a state manager for picking form selections */
  function selectHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (!hasOption(name, options, "onPickItem")) {
      field.onChange(event.target.value);
      return;
    }
    const selectItem = getOption(
      name,
      options,
      "onPickItem"
    ) as ConstructorOption["onPickItem"];
    if (selectItem) {
      selectItem(event.target.value);
    }
    field.onChange(event.target.value);
  }

  if (
    hasOption(name, options, "boolean") ||
    typeof initialValue === "boolean"
  ) {
    return (
      <FormControlLabel
        control={<Checkbox {...field} defaultChecked={Boolean(initialValue)} />}
        label={label}
      />
    );
  } else if (hasOption(name, options, "selections")) {
    return (
      <TextField
        {...field}
        disabled={fieldDisabled}
        error={!!errors[name]}
        fullWidth={fullWidth}
        helperText={errors[name]?.message as string}
        id={name}
        label={label}
        onChange={selectHandler}
        required={!isOptional}
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
  } else if (
    hasOption(name, options, "disabled") &&
    hasOption(name, options, "value")
  ) {
    return (
      <TextField
        disabled
        fullWidth={fullWidth}
        id={name}
        label={label}
        required={!isOptional}
        sx={{
          margin: "0.5rem 0.5rem 0.5rem 0",
          width: !fullWidth ? "25rem" : "100%",
        }}
        value={presetValue}
      />
    );
  } else if (hasOption(name, options, "date")) {
    return (
      <TextField
        {...field}
        disabled={fieldDisabled}
        error={!!errors[name]}
        helperText={!!errors[name]?.message && "Please enter a valid date."}
        id={name}
        label={label}
        onChange={changeHandler}
        required={!isOptional}
        sx={{
          "& .MuiInputLabel-root": {
            backgroundColor: "white",
            transform: "translate(15px, -7px) scale(0.75)",
          },
          margin: "0.5rem 0.5rem 0.5rem 0",
          width: !fullWidth ? "25rem" : "100%",
        }}
        type="date"
      />
    );
  } else {
    return (
      <TextField
        {...field}
        {...multilineProps}
        disabled={fieldDisabled}
        error={!!errors[name]}
        fullWidth={fullWidth}
        helperText={errors[name]?.message as string}
        id={name}
        label={label}
        onChange={changeHandler}
        required={!isOptional}
        sx={{
          margin: "0.5rem 0.5rem 0.5rem 0",
          width: !fullWidth ? "25rem" : "100%",
        }}
        variant="outlined"
      />
    );
  }
}
