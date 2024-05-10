export default function InfoText({ text }: { text: string }) {
  return (
    <h1 className="rounded-full bg-white bg-opacity-30 px-2 text-sm font-normal text-gray-800">
      {text}
    </h1>
  );
}
