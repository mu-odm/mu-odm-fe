import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddClientButtonProps {
  onAddClient: (newClient: {
    name: string;
    email: string;
    location: string;
    contact: string;
    contract_year: number;
    user_id: string | null;
    deferstatus: boolean; // Include deferstatus in props
  }) => void;
  userRegion: string | null;
  userId: string | null;
}

const AddClientButton: React.FC<AddClientButtonProps> = ({
  onAddClient,
  userRegion,
  userId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    location: userRegion || "",
    contact: "",
    contract_year: 0,
    user_id: userId,
  });

  // Update location and userId if userRegion or userId changes
  useEffect(() => {
    setNewClient((prev) => ({
      ...prev,
      location: userRegion || "",
      user_id: userId,
    }));
  }, [userRegion, userId]);

  const handleAddClient = () => {
    // Log newClient data to verify correct values
    console.log("New client data before API call:", newClient);

    // Calculate deferstatus based on the current year and contract year
    const currentYear = new Date().getFullYear();
    const deferstatus = currentYear - newClient.contract_year <= 2;

    // Validate and submit if contract year and other fields are set
    if (
      newClient.name &&
      newClient.email &&
      newClient.location &&
      newClient.contact &&
      newClient.contract_year > 0
    ) {
      onAddClient({ ...newClient, deferstatus }); // Call the parent function with newClient data and deferstatus
      setNewClient({
        name: "",
        email: "",
        location: userRegion || "",
        contact: "",
        contract_year: 0,
        user_id: userId,
      }); // Reset client data
      setShowModal(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        className="bg-red-500 text-white py-2 px-4 rounded w-full transition duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setShowModal(true)}
      >
        + Add Client
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="bg-white p-6 rounded shadow-md">
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
              <CardDescription>
                Fill in the details to add a new client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_name">Name</Label>
                    <Input
                      id="client_name"
                      placeholder="Client Name"
                      value={newClient.name}
                      onChange={(e) =>
                        setNewClient({ ...newClient, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_email">Email</Label>
                    <Input
                      id="client_email"
                      type="email"
                      placeholder="Client Email"
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_location">Location</Label>
                    <Input
                      id="client_location"
                      placeholder="Client Location"
                      value={newClient.location}
                      onChange={(e) =>
                        setNewClient({ ...newClient, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_contact">Contact</Label>
                    <Input
                      id="client_contact"
                      placeholder="Client Contact"
                      value={newClient.contact}
                      onChange={(e) =>
                        setNewClient({ ...newClient, contact: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="client_contract_year">Contract Year</Label>
                    <Input
                      id="client_contract_year"
                      type="number"
                      placeholder="Contract Year"
                      value={newClient.contract_year.toString()}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          contract_year: parseInt(e.target.value), // Ensure a valid year
                        })
                      }
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="flex justify-between p-4">
              <button
                onClick={handleAddClient}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddClientButton;
