"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import { useGetClients, UseClient, useAddClient, useUpdateClient, Client } from "@/api/user/useClient";
import { useGetUser } from "@/api/user/useUser";
import { useSession } from "next-auth/react";
import AddClientButton from "@/components/addclient";

export default function ClientManager() {
  const session = useSession();
  const [clientsMoreThan2Years, setClientsMoreThan2Years] = useState<UseClient[]>([]);
  const [clients2YearsOrLess, setClients2YearsOrLess] = useState<UseClient[]>([]);
  const { data: initialClients, isLoading: isLoadingClients, error: clientsError } = useGetClients();
  const addClientMutation = useAddClient();
  const updateClientMutation = useUpdateClient();
  const currentYear = new Date().getFullYear();
  const sessionEmail = session.data?.user?.sub;
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetUser(sessionEmail || "");

  useEffect(() => {
    if (user && initialClients) {
      const userFilteredClients = initialClients.filter(client => client.user.id === user.id);

      setClientsMoreThan2Years(userFilteredClients.filter(client => currentYear - client.contract_year > 2));
      setClients2YearsOrLess(userFilteredClients.filter(client => currentYear - client.contract_year <= 2));
    }
  }, [user, initialClients]);

  const handleAddClient = (newClient: { name: string; email: string; contract_year: number; location: string; contact: string }) => {
    const clientData: Client = {  
      id: Date.now().toString(),
      ...newClient,
      user_id: user?.id ?? "",
      deferstatus: false, 
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
            <AddClientButton onAddClient={handleAddClient} userId={user?.id ?? null} userRegion={user?.region || null} />

            {[{ title: "Clients with Contract Year Difference > 2", clients: clientsMoreThan2Years },
              { title: "Clients with Contract Year Difference <= 2", clients: clients2YearsOrLess }].map(({ title, clients }) => (
              <div key={title} className="mt-8">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
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
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td className="py-2 px-10">{client.name}</td>
                        <td className="py-2 px-8">{client.email}</td>
                        <td className="py-2 px-10">{client.location}</td>
                        <td className="py-2 px-10">{client.contact}</td>
                        <td className="py-2 px-10">
                          <label className="switch-container">
                            <input
                              type="checkbox"
                              className="switch-input"
                              checked={client.deferstatus ?? false} // Use a default value to prevent undefined
                            />
                            <span className="switch-label">
                              <span className="switch-button" />
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {clientsMoreThan2Years.length === 0 && clients2YearsOrLess.length === 0 && <div>No clients available for your account.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
