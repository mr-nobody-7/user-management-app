'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusIcon, Pencil, Trash2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  // Add new user
  const addUser = async () => {
    if (name && email) {
      try {
        const response = await axios.post("http://localhost:3000/users", { name, email });
        setUsers([...users, response.data]);
        setName("");
        setEmail("");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || "Failed to Add user");
        } else {
          console.error(error);
        }
      }
    }
  };

  // Open dialog to edit user
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setIsDialogOpen(true);
  };

  // Update existing user
  const updateUser = async () => {
    if (editingUser && name && email) {
      try {
        const response = await axios.put(`http://localhost:3000/users/${editingUser.id}`, { name, email });
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setIsDialogOpen(false);
        setEditingUser(null);
        setName("");
        setEmail("");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert(error.response?.data?.message || "Failed to update user");
        } else {
          console.error(error);
        }
      }
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addUser();
            }}
            className="space-y-3"
          >
            <div>
              <Label htmlFor="name" className="text-sm">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="mt-1"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={addUser} size="sm">
            Add User
            <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <CardTitle className="text-base">{user.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(user)}
                className="text-xs px-2 py-1"
              >
                <Pencil className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteUser(user.id)}
                className="text-xs px-2 py-1"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              {`Make changes to the user's information here. Click save when you're done.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={updateUser}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
