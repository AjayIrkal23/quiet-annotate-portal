import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASEURL } from "@/lib/utils";

interface UserItem {
  name: string;
  employeeId: string;
  email: string;
  jwtoken: string;
  role: string | null;
  imagesValidated: number;
  validatedCorrect: number;
  validatedWrong: number;
  verificationCode: string;
  isActive: boolean;
  department: string;
  isAdmin: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [department, setDepartment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = department ? { department } : {};
      const res = await axios.post(`${BASEURL}/users/getall`, payload);
      setUsers(res.data || []);
    } catch (e: any) {
      console.error(e);
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCount = users.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 text-sm">Admin panel to view and filter users by department</p>
      </header>

      <section className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1">
            <label className="block text-gray-300 text-sm mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Safety, QA"
              className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "Apply Filter"}
          </button>
        </div>
        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
      </section>

      <section className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Users ({filteredCount})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-300">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Employee ID</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Department</th>
                <th className="py-2 px-3">Active</th>
                <th className="py-2 px-3">Admin</th>
                <th className="py-2 px-3">Validated</th>
                <th className="py-2 px-3">Correct</th>
                <th className="py-2 px-3">Wrong</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.employeeId} className="border-t border-gray-700 text-gray-200">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.employeeId}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.role || "-"}</td>
                  <td className="py-2 px-3">{u.department || "-"}</td>
                  <td className="py-2 px-3">{u.isActive ? "Yes" : "No"}</td>
                  <td className="py-2 px-3">{u.isAdmin ? "Yes" : "No"}</td>
                  <td className="py-2 px-3">{u.imagesValidated}</td>
                  <td className="py-2 px-3">{u.validatedCorrect}</td>
                  <td className="py-2 px-3">{u.validatedWrong}</td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
