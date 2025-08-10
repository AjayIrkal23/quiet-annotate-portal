import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserItem {
  name: string;
  employeeId: string;
  email: string;
  role: string | null;
  imagesValidated: number;
  validatedCorrect: number;
  department: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASEURL}/users/`, { signal });
      setUsers(res.data || []);
      setAllUsers(res.data || []);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error(err);
        setError("Failed to fetch users");
        setUsers([]);
        setAllUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);
    return () => controller.abort();
  }, []);

  // Apply filters instantly
  useEffect(() => {
    let filtered = allUsers;

    if (nameFilter.trim()) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (departmentFilter && departmentFilter !== "all") {
      filtered = filtered.filter(
        (u) => u.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }

    setUsers(filtered);
  }, [nameFilter, departmentFilter, allUsers]);

  const cancelFilters = () => {
    setNameFilter("");
    setDepartmentFilter(undefined);
    setUsers(allUsers);
  };

  const departmentOptions = Array.from(
    new Set(allUsers.map((u) => u.department).filter(Boolean))
  );

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View and filter users by name or department
        </p>
      </header>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />

        <Select
          value={departmentFilter}
          onValueChange={(value) => setDepartmentFilter(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            {departmentOptions.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={cancelFilters}
          disabled={loading || (!nameFilter && !departmentFilter)}
        >
          Cancel Filters
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0
            ? users.map((u) => (
                <TableRow key={u.employeeId}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.employeeId}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role || "-"}</TableCell>
                  <TableCell>{u.department || "-"}</TableCell>
                </TableRow>
              ))
            : !loading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
