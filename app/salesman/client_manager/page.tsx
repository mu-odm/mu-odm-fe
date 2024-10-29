"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { useGetClients, Client, useUpdateClient } from "@/api/user/useClient";
import { useGetAllUsers } from "@/api/user/useUser";
import { useSession } from "next-auth/react";
import AddClientButton from "@/components/addclient"; // Adjust the import path as necessary
import { useAddClient } from "@/api/user/useClient"; // Adjust the import path as necessary

export default function ClientManager() {
  const session = useSession();
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [userRegion, setUserRegion] = useState<string | null>(null);

  // Fetch all users and clients data
  const { data: allUsers, isLoading: isLoadingAllUsers, error: allUsersError } = useGetAllUsers();
  const { data: initialClients, isLoading: isLoadingClients, error: clientsError } = useGetClients();
  const updateClient = useUpdateClient();

  const [ defer, setDefer ] = useState(false);

  const addClientMutation = useAddClient(); // Use the add client mutation

  useEffect(() => {
    if (!isLoadingAllUsers && session.data && allUsers) {
      const foundUser = allUsers.find((user) => user.email === session?.data?.user?.sub);
      if (foundUser) {
        setUserRegion(foundUser.region);
      } else {
        setUserRegion(null);
      }
    }
  }, [isLoadingAllUsers, session.data, allUsers]);

  useEffect(() => {
    if (userRegion && initialClients) {
      const regionFilteredClients = initialClients.filter((client) => client.location === userRegion);
      setFilteredClients(regionFilteredClients);
    } else {
      setFilteredClients([]); // Clear clients if no user region or clients data is not available
    }
  }, [userRegion, initialClients]);

  const handleAddClient = (newClient: Client) => {
    const clientData: Client = {
      ...newClient,
      contract_year: 0
    };

    // Call the add client mutation
    addClientMutation.mutate(clientData, {
      onSuccess: () => {
        // Optionally, you can handle success or show a notification
        console.log("Client added successfully!");
      },
      onError: (error) => {
        console.error("Error adding client:", error);
      },
    });
  };

  const handleDefer = (client: Client) => {
    setDefer(!defer);
    
    updateClient.mutate({
      ...client,
      deferStatus: !defer
    });
  }

  // Loading and error states
  if (isLoadingClients || isLoadingAllUsers) return <div>Loading...</div>;

  if (clientsError || allUsersError) {
    return (
      <div>
        <p>Error fetching data:</p>
        <p>Clients Error: {clientsError?.message}</p>
        <p>All Users Error: {allUsersError?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">

            {/* Add Client Button Component */}
            <AddClientButton onAddClient={handleAddClient} userRegion={userRegion} />


            {/* Display current user's region */}
            {userRegion && (
              <div className="mb-4 text-center">
                <p className="text-lg font-semibold">Current User Region: {userRegion}</p>
              </div>
            )}

            {/* Display filtered clients */}
            {filteredClients.length > 0 ? (
              <table className="w-full text-sm border-t">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left py-2 px-10">Name</th>
                    <th className="text-left py-2 px-8">Email</th>
                    <th className="text-left py-2 px-10">Location</th>
                    <th className="text-left py-2 px-10">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client: Client) => (
                    <tr key={client.id}>
                      <td className="py-2 px-10">{client.name}</td>
                      <td className="py-2 px-18 w-1/6">{client.email}</td>
                      <td className="py-2 px-10 overflow-scroll-cell w-1/6">{client.location}</td>
                      <td className="py-2 px-10">{client.contact}</td>
                      <input type="checkbox" value="synthwave" defaultChecked={defer}
                        onClick={() => handleDefer(client)}
                      className="toggle theme-controller" />
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No clients available in your location.</div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}
