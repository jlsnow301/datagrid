import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { useMemo } from "react";
import { Control, useController, useForm } from "react-hook-form";
import {
  DynamicFormProps,
  ConstructorOptions,
  RowData,
} from "../../types/tableConstructor";
import { toTitleCase } from "../../util/strings";
import {
  getInitialValue,
  getSelections,
  getZodSchema,
  hasOption,
} from "../../util/tableConstructor";

/**
 * ## DynamicForm
 * Ideally used in conjuction with DynamicTable. This component will take a row
 * of data and create a form from it. The form will be pre-populated with the
 * data from the row.
 */
export function DynamicForm(props: DynamicFormProps) {
  const { content, options, onClose, onSubmit } = props;
  const schema = useMemo(() => getZodSchema(content, options), [content]);
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const toDisplay =
    (options &&
      Object.keys(options).filter(
        (key) => !hasOption(key, options, ["hidden", "noForm"])
      )) ||
    Object.keys(content);

  const isSmallList = toDisplay.length < 12;

  function onSubmitClick(data: RowData) {
    onSubmit({ ...content, ...data });
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

  const validDefault = useMemo(() => {
    switch (true) {
      case initialValue === -1:
        return "";
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
