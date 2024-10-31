"use client";

import { useToast } from "@/hooks/use-toast";

const useToastHandler = () => {
  const { toast } = useToast();

  const toaster = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
    });
  };

  return toaster;
};

export default useToastHandler;
