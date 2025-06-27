import Footer from "@/components/shared/Footer";
import Providers from "@/components/providers/ReactQueryProvider";
import { UserProvider } from "@/components/auth/Context/UserContext";
import { getAuthenticatedUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import HeaderAdmin from "@/components/admin/HeaderAdmin";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = {
    id: "",
    role: "",
    email: "",
  };

  console.log("user", user);

  try {
    const userData = await getAuthenticatedUser(); // fonctionne car côté server

    user = {
      id: userData.id,
      role: userData.role,
      email: userData.email,
    };
    console.log("user", user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    redirect("/connexion-admin"); // Redirigez vers la page de connexion si l'utilisateur n'est pas authentifié
  }

  return (
    <UserProvider user={user}>
      <Providers>
        <div className="fixed top-0 left-0 w-full z-50">
          <HeaderAdmin />
        </div>
        {children}
        <Footer />
      </Providers>
    </UserProvider>
  );
}
