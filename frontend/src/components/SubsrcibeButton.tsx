import { useAtomValue } from "jotai";
import { Loader, UserMinus, UserPlus } from "lucide-react";

import { bearerAtom } from "@/features/bearerAtom";
import {
  useGetSubscriptionState,
  useSetSubscriptionState,
} from "@/features/queries";

import { Button } from "./ui/button";

export function SubscribeButton() {
  const bearer = useAtomValue(bearerAtom);
  const bearerPresent = !!bearer;

  const { data: subscriptionState } = useGetSubscriptionState({
    enabled: bearerPresent,
  });

  const { mutate: setSubscriptionState, isPending } = useSetSubscriptionState();

  const handleClick = () => {
    if (subscriptionState) {
      setSubscriptionState(!subscriptionState.value);
    }
  };

  const isSubscribed = !!subscriptionState?.value;

  return (
    bearerPresent && (
      <Button
        onClick={handleClick}
        className="flex items-center gap-3 w-[120px]"
        variant="outline"
      >
        {isPending && <Loader />}
        {!isPending && (isSubscribed ? <UserMinus /> : <UserPlus />)}
        {!isPending && (isSubscribed ? "Unsubscribe" : "Subscribe")}
      </Button>
    )
  );
}
