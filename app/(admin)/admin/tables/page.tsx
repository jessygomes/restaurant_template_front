import TableList from "@/components/admin/Tables/TableList";
import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";

export default async function TablesAdmin() {
  const user = await currentUser();

  if (
    !user ||
    typeof user !== "object" ||
    !("userId" in user) ||
    typeof user.userId !== "string"
  ) {
    redirect("/");
  }
  // console.log("User in Tables Admin:", user.userId);

  return (
    <div className="py-20 px-20 bg-white flex justify-center items-center">
      <section className="w-full h-screen flex flex-col bg-white">
        <div>
          <TableList userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
