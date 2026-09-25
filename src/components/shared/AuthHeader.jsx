export default function AuthHeader({
  title = "Taleb",
  role = "",
  heading = "",
  description = "",
  titleClass = "text-4xl lg:text-6xl",
  roleClass = "text-xl",
  headingClass = "text-sm",
  descriptionClass = "text-sm",
}) {
  return (
    <div className="space-y-2">
      <h1
        className={`font-secondary  text-center ${titleClass}`}
      >
        {title}
      </h1>

      {role && (
        <p
          className={`text-center font-bold text-gray-500 ${roleClass}`}
        >
          {role}
        </p>
      )}

      {heading && (
        <p
          className={`text-center font-bold ${headingClass}`}
        >
          {heading}
        </p>
      )}

      {description && (
        <p
          className={`text-center text-gray-500 ${descriptionClass}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}