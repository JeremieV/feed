import { getSubscriptions } from "@/app/server/queries";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from 'react';

export function useSubscriptions() {
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['subscriptions'],
    // FOR SOME MYSTERIOUS REASON USING THE FOLLOWING LINE BREAKS THE QUERY
    // queryFn: getSubscriptions
    // (ALSO BE VERY CARFUL WITH QUERY KEYS, CHECK THEY ARE UNIQUE)
    queryFn: async () => {
      return await getSubscriptions()
    }
  })
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}