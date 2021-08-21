export default function Image({ params }) {
  return (
    <img
      src={
        params.type === "Locked"
          ? params.isLP
            ? "/ic_lockedstaking_lp.svg"
            : "/ic_lockedstaking.svg"
          : params.isLP
          ? "/ic_flexiblestaking_lp.svg"
          : "/ic_flexiblestaking.svg"
      }
    />
  );
}
