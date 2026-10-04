import { useId, useRef, useState } from "react";
import type { DragEvent, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { ProgressBar } from "../ProgressBar/ProgressBar";

export type FileType = "dropzone" | "item";
export type FileState = "default" | "dragover" | "uploaded" | "uploading" | "error";

export interface FileProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children" | "onDrop"> {
  /** Figma `type`. `dropzone` is the area to drop or browse; `item` is one added file. */
  type?: FileType;
  /** Figma `state`. Dropzone: default | dragover. Item: uploaded | uploading | error. */
  state?: FileState;
  /** Dropzone call to action. */
  title?: string;
  /** Dropzone accepted types and size limit. Never leave empty. */
  hint?: string;
  /** Item file name. */
  fileName?: string;
  /** Item type badge text, e.g. "PDF". */
  fileType?: string;
  /** Item meta line (uploaded: type and size; error: the reason). Uploading shows `Uploading · {progress}%`. */
  meta?: string;
  /** Item uploading progress, 0 to 100. */
  progress?: number;
  /** Item action label. Defaults: Remove (uploaded, error), Cancel (uploading). */
  actionLabel?: string;
  onAction?: () => void;
  /** Dropzone: files chosen by browsing or dropped. */
  onFiles?: (files: FileList) => void;
  /** Dropzone: `accept` and `multiple` for the native file input. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export function File({
  type = "dropzone",
  state,
  title = "Drop a file or browse",
  hint = "PDF, JPG or PNG · 10 MB each",
  fileName = "flight-TK1734.pdf",
  fileType = "PDF",
  meta,
  progress = 60,
  actionLabel,
  onAction,
  onFiles,
  accept,
  multiple,
  disabled,
  className,
  ...rest
}: FileProps) {
  if (type === "item") {
    const itemState = state === "uploading" || state === "error" ? state : "uploaded";
    const uploading = itemState === "uploading";
    const error = itemState === "error";
    const pct = Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0));
    const metaText =
      meta ?? (uploading ? `Uploading · ${pct}%` : error ? "Too large: the limit is 10 MB" : `${fileType} · 214 KB`);
    return (
      <div
        className={cn("hz-file", "hz-file--item", `hz-file--${itemState}`, className)}
        {...rest}
      >
        <span className="hz-file__thumbnail" aria-hidden="true">
          {fileType}
        </span>
        <div className="hz-file__details">
          <span className="hz-file__name">{fileName}</span>
          <span className="hz-file__meta" role={error ? "alert" : undefined}>
            {metaText}
          </span>
          {uploading && (
            <ProgressBar size="sm" value={pct} showLabel={false} showHelper={false} label={`Uploading ${fileName}`} />
          )}
        </div>
        <button type="button" className="hz-file__action" onClick={onAction} disabled={disabled}>
          {actionLabel ?? (uploading ? "Cancel" : "Remove")}
        </button>
      </div>
    );
  }
  return (
    <Dropzone
      {...{ state, title, hint, onFiles, accept, multiple, disabled, className }}
      rest={rest}
    />
  );
}

interface DropzoneProps
  extends Pick<FileProps, "state" | "title" | "hint" | "onFiles" | "accept" | "multiple" | "disabled" | "className"> {
  rest: HTMLAttributes<HTMLDivElement>;
}

function Dropzone({ state, title, hint, onFiles, accept, multiple, disabled, className, rest }: DropzoneProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const dragover = state ? state === "dragover" : over;

  const onDragOver = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setOver(true);
  };
  const onDragLeave = () => setOver(false);
  const onDropFiles = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (!disabled && e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files);
  };

  return (
    <div
      className={cn("hz-file", "hz-file--dropzone", dragover && "hz-file--dragover", className)}
      {...rest}
    >
      <label
        className="hz-file__zone"
        htmlFor={`${id}-input`}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDropFiles}
      >
        <input
          ref={input}
          id={`${id}-input`}
          className="hz-file__input"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={`${id}-hint`}
          onChange={(e) => {
            if (e.target.files?.length) onFiles?.(e.target.files);
            e.target.value = "";
          }}
        />
        <span className="hz-file__title">{title}</span>
        <span id={`${id}-hint`} className="hz-file__hint">
          {hint}
        </span>
      </label>
    </div>
  );
}

export default File;
