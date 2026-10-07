import { useEffect, useId, useRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";

export type ModalType = "dialog" | "sheet";
export type ModalTone = "default" | "destructive";

/** One label and value row of the Content slot. */
export interface ModalRow {
  label: string;
  value: string;
  /** Figma draws the value "No" in the error colour. */
  emphasis?: "error";
}

const DEFAULTS = {
  default: {
    title: "Add Ana to HS Admin?",
    message: "She gets an email to set a password and can sign in straight away.",
    rows: [
      { label: "Role", value: "Front desk" },
      { label: "Properties", value: "Casa do Bairro, Hotel Miramar" },
      { label: "Starts", value: "Today" },
    ] as ModalRow[],
    actions: ["Add admin", "Cancel"],
    note: "You can change her role later in Team and roles.",
  },
  destructive: {
    title: "Remove Luis Correia?",
    message: "This deletes the account. His name stays on the bookings and notes he made.",
    rows: [
      { label: "Bookings he created", value: "82, all stay as they are" },
      { label: "Guest notes he wrote", value: "14, kept with his name" },
      { label: "Can be undone", value: "No", emphasis: "error" },
    ] as ModalRow[],
    actions: ["Remove admin", "Cancel"],
    note: "Only owners see this button. Logged as admin.removed in the audit log.",
  },
} as const;

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDialogElement>, "title" | "onClose" | "onCancel"> {
  /** dialog (520 wide, centred) or sheet (390 wide, rounded top, grab handle). */
  type?: ModalType;
  /** default (primary actions) or destructive (error action). */
  tone?: ModalTone;
  /** Figma `showClose`: the close × in the header. */
  showClose?: boolean;
  /** Figma `showContent`: the Content slot below the header. */
  showContent?: boolean;
  /** Figma `showNote`: the note line under the actions. */
  showNote?: boolean;
  /**
   * Not a Figma property. Leave undefined to draw the panel in place, as the Figma component
   * set does (no backdrop, no focus handling). Pass true or false to show it on screen as a
   * native modal dialog on a backdrop: focus is trapped and restored, and Escape and a click on
   * the backdrop call onClose.
   */
  open?: boolean;
  /** Not a Figma property. Called by the close ×, Cancel, Escape and a click on the backdrop. */
  onClose?: () => void;
  /** Not a Figma property. Called by the main action button. */
  onAction?: () => void;
  /** Not a Figma property. Text overrides; the defaults are the Figma texts for the tone. */
  title?: string;
  message?: string;
  note?: string;
  /** Not a Figma property. Main action and cancel labels. */
  labels?: [string, string];
  /** Not a Figma property. The accessible name of the close ×. Figma draws no text for it. */
  closeLabel?: string;
  /** Not a Figma property. Rows of the default Content slot. */
  rows?: ModalRow[];
  /** Figma: "a Content slot with detail rows you can replace with any content". */
  children?: ReactNode;
}

export function Modal({
  type = "dialog",
  tone = "default",
  showClose = true,
  showContent = true,
  showNote = true,
  open,
  onClose,
  onAction,
  title,
  message,
  note,
  labels,
  closeLabel = "Close",
  rows,
  children,
  className,
  onClick,
  onMouseDown,
  ...rest
}: ModalProps) {
  const d = DEFAULTS[tone];
  const titleText = title ?? d.title;
  const messageText = message ?? d.message;
  const noteText = note ?? d.note;
  const actionLabels = labels ?? d.actions;
  const onScreen = open !== undefined;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el || !onScreen) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open, onScreen]);

  return (
    <dialog
      ref={dialogRef}
      open={onScreen ? undefined : true}
      className={cn(
        "hz-modal",
        `hz-modal--${type}`,
        `hz-modal--${tone}`,
        onScreen ? "hz-modal--screen" : "hz-modal--inline",
        className,
      )}
      aria-labelledby={titleId}
      aria-describedby={messageText ? messageId : undefined}
      onCancel={(event) => {
        // Escape. Keep the dialog open until the owner sets open to false.
        event.preventDefault();
        onClose?.();
      }}
      onClose={() => {
        // Closed natively (a second Escape cannot be cancelled) while the owner still says open.
        if (open) onClose?.();
      }}
      onMouseDown={(event: MouseEvent<HTMLDialogElement>) => {
        pressedBackdrop.current = event.target === event.currentTarget;
        onMouseDown?.(event);
      }}
      onClick={(event: MouseEvent<HTMLDialogElement>) => {
        // The panel fills the dialog, so a click whose target is the dialog itself hit the backdrop.
        if (onScreen && event.target === event.currentTarget && pressedBackdrop.current) onClose?.();
        onClick?.(event);
      }}
      {...rest}
    >
      <div className="hz-modal__panel">
        {type === "sheet" && (
          <div className="hz-modal__handle-row" aria-hidden="true">
            <span className="hz-modal__handle" />
          </div>
        )}
        <div className="hz-modal__header">
          <div className="hz-modal__text">
            <p id={titleId} className="hz-modal__title">
              {titleText}
            </p>
            {messageText && (
              <p id={messageId} className="hz-modal__message">
                {messageText}
              </p>
            )}
          </div>
          {showClose && (
            <button type="button" className="hz-modal__close" aria-label={closeLabel} onClick={() => onClose?.()}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {showContent &&
          (children ?? (
            <dl className="hz-modal__rows">
              {(rows ?? d.rows).map((row) => (
                <div key={row.label} className="hz-modal__row">
                  <dt className="hz-modal__row-label">{row.label}</dt>
                  <dd
                    className={cn("hz-modal__row-value", row.emphasis === "error" && "hz-modal__row-value--error")}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ))}
        <ButtonGroup
          className="hz-modal__actions"
          type={tone === "destructive" ? "destructive" : "primary"}
          layout={type === "sheet" ? "stack" : "row"}
          labels={[...actionLabels]}
          onItemClick={(index) => (index === 0 ? onAction?.() : onClose?.())}
        />
        {showNote && noteText && <p className="hz-modal__note">{noteText}</p>}
      </div>
    </dialog>
  );
}

export default Modal;
