// app/components/Header.tsx
type HeaderProps = {
  title: string;
  button1Text: string;
  button2Text: string;
};

export default function Header({ title, button1Text, button2Text }: HeaderProps) {
  return (
    <div className="flex justify-between items-center bg-red-500 text-white p-5">
      <h1 className="text-4xl">{title}</h1>
      <div className="flex space-x-4">
        <button className="bg-white text-black px-2 py-1">{button1Text}</button>
        <button className="bg-white text-black px-2 py-1">{button2Text}</button>
        <button className="bg-white text-black px-2 py-1">Log Out</button>
      </div>
    </div>
  );
}
