import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Image } from "../Image/Image";

export type CardType = "listing" | "stat";

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  type?: CardType;
  /** listing: photo source. */
  image?: string;
  /** listing: alt text for the photo. Empty means decorative. */
  imageAlt?: string;
  showTag?: boolean;
  tag?: string;
  title?: string;
  details?: string;
  price?: string;
  showRating?: boolean;
  rating?: string;
  showAction?: boolean;
  action?: string;
  /** stat: the small caption above the value. */
  label?: string;
  value?: string;
  showHelper?: boolean;
  helper?: string;
}

export function Card({
  type = "listing",
  image,
  imageAlt = "",
  showTag = false,
  tag = "Confirmed",
  title = "Casa do Bairro",
  details = "Alfama, Lisbon · 14 to 18 Sep",
  price = "121 EUR",
  showRating = true,
  rating = "4.7 (318)",
  showAction = false,
  action = "View",
  label = "Active admins",
  value = "27",
  showHelper = true,
  helper = "across 4 properties",
  className,
  ...rest
}: CardProps) {
  if (type === "stat") {
    return (
      <div className={cn("hz-card", "hz-card--stat", className)} {...rest}>
        <p className="hz-card__label">{label}</p>
        <p className="hz-card__value">{value}</p>
        {showHelper && <p className="hz-card__helper">{helper}</p>}
      </div>
    );
  }

  return (
    <div className={cn("hz-card", "hz-card--listing", className)} {...rest}>
      <div className="hz-card__photo">
        <Image src={image} alt={imageAlt} ratio="2:1" radius="none" />
        {showTag && <span className="hz-card__tag">{tag}</span>}
      </div>
      <div className="hz-card__body">
        <p className="hz-card__title">{title}</p>
        <p className="hz-card__details">{details}</p>
        <div className="hz-card__footer">
          <p className="hz-card__price">{price}</p>
          <div className="hz-card__right">
            {showRating && <p className="hz-card__rating">{rating}</p>}
            {showAction && <span className="hz-card__action">{action}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
