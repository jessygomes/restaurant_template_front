import UserInfos from "@/components/admin/Paramètres/UserInfos";
import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";

export default async function ParametreAdmin() {
  const user = await currentUser();

  if (
    !user ||
    typeof user !== "object" ||
    !("userId" in user) ||
    typeof user.userId !== "string"
  ) {
    redirect("/");
  }

  return (
    <div className="py-20 px-20 bg-white flex justify-center items-center">
      <section className="w-full h-screen flex flex-col bg-white">
        <div>
          <UserInfos userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
