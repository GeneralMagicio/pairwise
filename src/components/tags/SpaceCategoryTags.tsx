interface ISpaceCategoryTags {
  categories: Array<{ category: string }>
}

export const SpaceCategoryTags = ({ categories }: ISpaceCategoryTags) => {
  return (
    <>
      {categories.length > 0 ? (
        <div className="flex w-fit flex-wrap justify-center gap-1">
          {categories.map(({ category }) => (
            <span
              key={category}
              className="rounded-lg bg-green-100 px-3 py-1 text-sm font-bold text-green-800"
            >
              {category}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}
