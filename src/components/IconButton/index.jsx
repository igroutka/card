import { Link } from "react-router-dom"
import * as Icons from "../../assets/icons/icons"

export const IconButton = ({ url = "/", icon, onClick, className, attr }) => {
  const IconComponent = icon ? Icons[icon] : null
  return (
    <Link
      onClick={onClick}
      draggable="false"
      tsx-attr={attr}
      className={className}
      to={url}
    >
      {IconComponent && <IconComponent />}
    </Link>
  )
}
