import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { UserData } from "../../lib/types";
import { UsersTable } from "../../components/admin/users.table";
import adminService from "../../api/services/admin.service";

export default function ManageUsers() {
  const { setIsLoading } = useContext(AppContext);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      await adminService.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text">
          Manage Users
        </h1>
        <p className="text-foreground/70">View and manage system users</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-foreground/50" />
        <Input
          className="pl-10"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <UsersTable
        users={users}
        searchTerm={searchTerm}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
