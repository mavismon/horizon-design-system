import type { FormHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button/Button";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import { Link } from "../Link/Link";
import { Textfield } from "./Textfield";
import type { TextfieldProps } from "./Textfield";

export type FormType = "section" | "card";

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "title"> {
  type?: FormType;
  title?: string;
  description?: string;
  showDescription?: boolean;
  /** section only: the third field (Display name). */
  showField3?: boolean;
  /** section only: the fourth field (Phone). */
  showField4?: boolean;
  /** section only: the footnote under the actions. */
  showFootnote?: boolean;
  /** card only: the link under the button. */
  showLink?: boolean;
  /** Not a Figma property. Replaces the Figma fields (each field is a Textfield). */
  fields?: TextfieldProps[];
  /** Not a Figma property. Extra fields (Dropdown, Checkbox, Radiocard, Toggle ...) added after the fields. */
  children?: ReactNode;
  /** Not a Figma property. Footnote text (section). */
  footnote?: string;
  /** Not a Figma property. Texts of the actions: section = [Save changes, Cancel], card = [Sign in]. */
  actionLabels?: string[];
  /** Not a Figma property. Link text and href (card). */
  linkLabel?: string;
  linkHref?: string;
  /** Not a Figma property. Called when the Cancel button of a section form is clicked. */
  onCancel?: () => void;
}

const SECTION_FIELDS: TextfieldProps[] = [
  { label: "First name", defaultValue: "Mei", state: "filled" },
  { label: "Last name", defaultValue: "Tanaka", state: "filled" },
  { label: "Display name", placeholder: "How hosts see you" },
  { label: "Phone", defaultValue: "+351 912 345 678", state: "filled" },
];

const CARD_FIELDS: TextfieldProps[] = [
  { label: "Email", defaultValue: "mei.tanaka@gmail.com", state: "filled" },
  { label: "Password", placeholder: "Your password", type: "password" },
];

export function Form({
  type = "section",
  title = "Profile",
  description = "Hosts see your first name and photo when you book.",
  showDescription = true,
  showField3 = true,
  showField4 = true,
  showFootnote = true,
  showLink = true,
  fields,
  children,
  footnote = "Changes show on new bookings. Bookings already confirmed keep the old details.",
  actionLabels,
  linkLabel = "Forgot your password?",
  linkHref = "#",
  onCancel,
  onSubmit,
  className,
  ...rest
}: FormProps) {
  const isCard = type === "card";
  const base = fields ?? (isCard ? CARD_FIELDS : SECTION_FIELDS);
  // The Figma flags only hide the two optional fields of the default section form.
  const visible =
    fields || isCard
      ? base
      : base.filter((_, i) => (i === 2 ? showField3 : i === 3 ? showField4 : true));

  const handleSubmit: NonNullable<FormHTMLAttributes<HTMLFormElement>["onSubmit"]> = (event) => {
    if (!onSubmit) event.preventDefault();
    onSubmit?.(event);
  };

  return (
    <form
      className={cn("hz-form", `hz-form--${type}`, className)}
      noValidate
      onSubmit={handleSubmit}
      {...rest}
    >
      <div className="hz-form__heading">
        <h2 className="hz-form__title">{title}</h2>
        {showDescription && <p className="hz-form__description">{description}</p>}
      </div>
      <div className="hz-form__fields">
        {visible.map((field, i) => (
          <Textfield key={i} wrapperClassName="hz-form__field" showHelper={false} {...field} />
        ))}
        {children}
      </div>
      {isCard ? (
        <Button
          type="submit"
          className="hz-form__submit"
          text={actionLabels?.[0] ?? "Sign in"}
          startIcon={false}
          endIcon={false}
        />
      ) : (
        <ButtonGroup
          type="primary"
          labels={[actionLabels?.[0] ?? "Save changes", actionLabels?.[1] ?? "Cancel"]}
          onItemClick={(index, event) => {
            if (index === 0) event.currentTarget.form?.requestSubmit();
            else onCancel?.();
          }}
        />
      )}
      {!isCard && showFootnote && <p className="hz-form__footnote">{footnote}</p>}
      {isCard && showLink && <Link label={linkLabel} href={linkHref} />}
    </form>
  );
}

export default Form;
