export default function Image({ params }) {
  return (
    <img
      src={
        params.type === "Flexible"
          ? params.isLP
            ? "/ic_flexiblestaking_lp.png"
            : "/ic_flexiblestaking.svg"
          : params.isLP
            ? "/ic_lockedstaking_lp.png"
            : "/ic_lockedstaking.svg"
      }
    />
  );
}
