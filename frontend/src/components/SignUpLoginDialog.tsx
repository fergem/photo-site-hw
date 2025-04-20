import { useState } from "react";

import { SignUpLoginDialogTabsType } from "@/features/SignUpLoginDialogTabsType";

import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SignUpLoginDialog() {
  const [open, setOpen] = useState(false);
  const [tabState, setTabState] = useState<SignUpLoginDialogTabsType>(
    SignUpLoginDialogTabsType.SIGN_UP
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setTabState(SignUpLoginDialogTabsType.SIGN_UP)}
        >
          Register
        </Button>
      </DialogTrigger>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={() => setTabState(SignUpLoginDialogTabsType.LOGIN)}
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <Tabs
          defaultValue="account"
          className="mt-4"
          value={tabState}
          onValueChange={(value) =>
            setTabState(value as SignUpLoginDialogTabsType)
          }
        >
          <DialogTitle />
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={SignUpLoginDialogTabsType.SIGN_UP}>
              Register
            </TabsTrigger>
            <TabsTrigger value={SignUpLoginDialogTabsType.LOGIN}>
              Login
            </TabsTrigger>
          </TabsList>
          <TabsContent value={SignUpLoginDialogTabsType.SIGN_UP}>
            <SignUpForm
              onSuccess={() => setTabState(SignUpLoginDialogTabsType.LOGIN)}
            />
          </TabsContent>
          <TabsContent value={SignUpLoginDialogTabsType.LOGIN}>
            <LoginForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
