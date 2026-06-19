'use client'
import { dialog, DialogContainer, DialogProvider } from "@/registry/promise-dialog";
import { Button } from "@/components/ui/button";
import { TesteComponent } from "@/components/teste-component";
import { useState } from "react";

export default function Home() {

  const [status, setStatus] = useState(false)

  async function openDialog() {
    const result = await dialog(TesteComponent, { title: `Dialog de TESTE`, data: new Date().toJSON()})

    setStatus(!!result)
    console.log(result)
  }

  return (
    <div className="p-4">
      <Button onClick={openDialog}>Clique</Button>

      {status ? "SIM" : "NAO"} <br />
      <DialogContainer />
    </div>
  );
}
