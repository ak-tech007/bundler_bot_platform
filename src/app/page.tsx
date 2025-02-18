import Image from "next/image";
import AdminLogin from "./_components/AdminLogin";
import RunButton from "./_components/RunButton";

export default function Home() {
  return (
    <>
      <AdminLogin />
      <RunButton />
    </>
  );
}
