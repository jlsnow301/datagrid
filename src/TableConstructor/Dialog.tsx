import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { useState } from "react";
import { DynamicForm } from "./Form";
import { DynamicDialogProps, RowData } from "./types";
import { DynamicWizard } from "./Wizard";

export function DynamicDialog(props: DynamicDialogProps) {
  const { options, initialContent, modalIsOpen, onClose, onSubmit, templates } =
    props;
  const [content, setContent] = useState<RowData>(initialContent);
  const [dialogMode, setDialogMode] = useState<"edit" | "wizard">("edit");
  const hasTemplates = (templates && templates?.length > 0) || false;

  let dialogTitle;
  if (dialogMode === "edit") {
    dialogTitle = `${
      !content || !Object.values(content)[0] ? "Insert" : "Edit"
    } Data`;
  } else if (dialogMode === "wizard") {
    dialogTitle = "Template Wizard";
  }

  /** Toggle dialog between edit and wizard modes */
  const handleChangeMode = () => {
    setDialogMode(dialogMode === "edit" ? "wizard" : "edit");
  };

  const onSetTemplate = (selected: RowData) => {
    setContent(selected);
    setDialogMode("edit");
  };

  return (
    <Dialog
      maxWidth="md"
      open={modalIsOpen}
      onClose={onClose}
      aria-labelledby="recommendations-dialog"
    >
      <DialogTitle
        id="recommendations-dlg-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {dialogTitle}
        {hasTemplates && (
          <Button
            onClick={handleChangeMode}
            sx={{ paddingLeft: "0.5rem" }}
            variant="contained"
          >
            <SwapHorizIcon sx={{ marginRight: "0.5rem" }} /> Switch to{" "}
            {dialogMode === "edit" ? "wizard" : "edit"}
          </Button>
        )}
      </DialogTitle>
      {dialogMode === "edit" ? (
        <DynamicForm
          {...{
            content,
            options,
            onClose,
            onSubmit,
          }}
        />
      ) : (
        <DynamicWizard
          {...{
            onSetTemplate,
            onClose,
            templates,
          }}
        />
      )}
    </Dialog>
  );
}
