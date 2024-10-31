"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { useGetClients, useAddClient, useUpdateClient } from "@/api/user/useClient";
import { Client } from "@/types/db-schema";
import { useGetUser } from "@/api/user/useUser";
import { useSession } from "next-auth/react";
import AddClientButton from "@/components/addclient";
import LoadingAnimation from "@/components/loading_animation";

export default function ClientManager() {
  const session = useSession();
  const [deferredClients, setDeferredClients] = useState<Client[]>([]);
  const [activeClients, setActiveClients] = useState<Client[]>([]);
  const { data: initialClients, isLoading: isLoadingClients, error: clientsError, refetch: refetchClients } = useGetClients();
  const addClientMutation = useAddClient();
  const updateClientMutation = useUpdateClient();
  const sessionEmail = session.data?.user?.sub;

  const { data: user, isLoading: isLoadingUser, error: userError } = useGetUser(sessionEmail!);

  useEffect(() => {
    if (user && initialClients) {
      const userFilteredClients = initialClients.filter(client => client.user_id === session.data?.user?.id);
      
      setDeferredClients(userFilteredClients.filter(client => client.deferStatus));
      setActiveClients(userFilteredClients.filter(client => !client.deferStatus));
    }
  }, [user, initialClients]);

  const handleAddClient = (newClient: { name: string; email: string; location: string; contact: string }) => {

    if (!user?.id) {
      return (
        <LoadingAnimation/>
      )
    }

    const clientData: Client = {
      id: Date.now().toString(),
      ...newClient,
      user_id: user?.id,
      deferStatus: true,
      contract_year: new Date().getFullYear(),
    };
  
    if (!clientData.user_id) {
      console.error("User ID is not available. Cannot add client.");
      return;
    }
  
    addClientMutation.mutate(clientData, {
      onSuccess: () => console.log("Client added successfully!"),
      onError: (error) => console.error("Error adding client:", error),
    });
  };

  const handleDefer = (client: Client) => {
    const updatedClient = { ...client, deferStatus: !client.deferStatus }; // Toggle defer status
    updateClientMutation.mutate(updatedClient, {
      onSuccess: () => {
        console.log("Client defer status updated successfully!");
        refetchClients(); // Fetch updated clients after mutation
      },
      onError: (error) => console.error("Error updating defer status:", error),
    });
  };

  if (session.status === "loading" || isLoadingClients || isLoadingUser) return <div>Loading...</div>;
  if (session.status === "unauthenticated") return <div>You need to be logged in to manage clients.</div>;
  if (clientsError || userError) return (
    <div>
      <p>Error fetching data:</p>
      <p>Clients Error: {clientsError?.message}</p>
      <p>User Error: {userError?.message}</p>
    </div>
  );

  return (
    <div className="flex-1 bg-white">
      <div className="p-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <AddClientButton onAddClient={handleAddClient} userId={session.data?.user?.id ?? null} userRegion={user?.region || null} />

            {/* Clients with Defer Status */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Defer Clients</h2>
              <table className="w-full text-sm border-t mb-8">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left py-2 px-10">Name</th>
                    <th className="text-left py-2 px-8">Email</th>
                    <th className="text-left py-2 px-10">Location</th>
                    <th className="text-left py-2 px-10">Contact</th>
                    <th className="text-left py-2 px-10">Defer Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deferredClients.map(client => (
                    <tr key={client.id}>
                      <td className="py-2 px-10">{client.name}</td>
                      <td className="py-2 px-8">{client.email}</td>
                      <td className="py-2 px-10">{client.location}</td>
                      <td className="py-2 px-10">{client.contact}</td>
                      <td className="py-2 px-10">
                        <input
                          type="checkbox"
                          checked={client.deferStatus ?? false}
                          onChange={() => handleDefer(client)}
                          className="toggle theme-controller"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clients without Defer Status */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Active Clients</h2>
              <table className="w-full text-sm border-t mb-8">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left py-2 px-10">Name</th>
                    <th className="text-left py-2 px-8">Email</th>
                    <th className="text-left py-2 px-10">Location</th>
                    <th className="text-left py-2 px-10">Contact</th>
                    <th className="text-left py-2 px-10">Defer Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClients.map(client => (
                    <tr key={client.id}>
                      <td className="py-2 px-10">{client.name}</td>
                      <td className="py-2 px-8">{client.email}</td>
                      <td className="py-2 px-10">{client.location}</td>
                      <td className="py-2 px-10">{client.contact}</td>
                      <td className="py-2 px-10">
                        <input
                          type="checkbox"
                          checked={client.deferStatus ?? false}
                          onChange={() => handleDefer(client)}
                          className="toggle theme-controller"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(deferredClients.length === 0 && activeClients.length === 0) && <div>No clients available for your account.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
