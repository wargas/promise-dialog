import { useDialog } from "@/registry/promise-dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function TesteComponent() {
    
    const { close, options } = useDialog()

    return <div>
        TESTE

        <Button onClick={() => close(null)}>Cancelar</Button>
        <Button onClick={() => close(true)}>OK</Button>

        <Input defaultValue={options.data} />
    </div>
}