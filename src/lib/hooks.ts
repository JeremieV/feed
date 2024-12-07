import { getSubscriptions } from "@/app/server/queries";
import { useQuery } from "@tanstack/react-query";

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    // FOR SOME MYSTERIOUS REASON USING THE FOLLOWING LINE BREAKS THE QUERY
    // queryFn: getSubscriptions
    // (ALSO BE VERY CARFUL WITH QUERY KEYS, CHECK THEY ARE UNIQUE)
    queryFn: async () => {
      return await getSubscriptions()
    }
  })
}