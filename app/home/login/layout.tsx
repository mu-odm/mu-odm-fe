import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session?.user?.role !== "ADMIN") {
      redirect("/salesman/product_view");
    } else if (session?.user?.role === "ADMIN") {
      redirect("/admin/all_orders");
    }
  }

  return children;
}
