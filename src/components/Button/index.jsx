import { Link } from "react-router-dom"
import * as Icons from "../../assets/icons/icons"

export const Button = ({
  url = "/",
  iconL,
  iconR,
  className,
  attr,
  text,
  onClick,
}) => {
  const IconL = iconL ? Icons[iconL] : null
  const IconR = iconR ? Icons[iconR] : null
  return (
    <Link
      onClick={onClick}
      draggable="false"
      tsx-attr={attr}
      className={className}
      to={url}
    >
      {IconL && <IconL />}
      {text}
      {IconR && <IconR />}
    </Link>
  )
}
