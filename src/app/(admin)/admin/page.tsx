import AdminDashboard from "@/components/admin/AdminDashboard";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          <AdminDashboard />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
