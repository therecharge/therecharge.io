export default function Image({ type }) {
  return (
    <img
      src={
        type === "locked" ? "/ic_lockedstaking.svg" : "/ic_flexiblestaking.svg"
      }
    />
  );
}
