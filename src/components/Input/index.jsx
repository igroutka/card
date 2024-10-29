import * as Icons from "../../assets/icons/icons"

export const Input = ({
  iconL,
  iconR,
  className,
  attr,
  text,
  type,
  onChange,
  name,
  value,
}) => {
  const IconL = iconL ? Icons[iconL] : null
  const IconR = iconR ? Icons[iconR] : null
  return (
    <div className={className}>
      {IconL && <IconL />}
      <input
        onChange={onChange}
        value={value}
        name={name}
        type={type}
        tsx-attr={attr}
      />
      {IconR && <IconR />}
    </div>
  )
}
