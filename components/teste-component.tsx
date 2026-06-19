import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useDialog } from "./ui/promise-dialog"

export function TesteComponent() {
    
    const { close, options } = useDialog()

    return <div>
        TESTE

        <Button onClick={() => close(null)}>Cancelar</Button>
        <Button onClick={() => close(true)}>OK</Button>

        <Input defaultValue={options.data} />
    </div>
}