export default function InfoText({ text }: { text: string }) {
  return (
    <h1 className="bg-white bg-opacity-30 px-2 font-normal text-sm rounded-full text-gray-800">
      {text}
    </h1>
  );
}
