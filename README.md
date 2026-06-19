# promise-dialog

Biblioteca de demonstração para modais/drawers baseados em promessa no Next.js + React.

## Sobre

Este projeto mostra como abrir um diálogo dinamicamente a partir de qualquer componente usando uma API baseada em `Promise`.

O `promise-dialog` renderiza componentes dentro de um `DialogContainer` global e permite que o componente filho retorne dados quando o modal é fechado.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vaul (drawer)
- eventemitter3
- lodash


## Como usar

1. Envolva o app com o `DialogContainer` uma vez, normalmente no layout ou na página principal.
2. Chame `dialog(SeuComponente, options)` para abrir o modal.
3. No componente renderizado, use `useDialog()` para fechar e receber opções.

### Exemplo

```tsx
'use client'

import { dialog, DialogContainer } from '@/components/ui/promise-dialog'
import { Button } from '@/components/ui/button'
import { TesteComponent } from '@/components/teste-component'
import { useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState(false)

  async function openDialog() {
    const result = await dialog(TesteComponent, {
      title: 'Dialog de TESTE',
      data: new Date().toJSON(),
    })

    setStatus(!!result)
    console.log(result)
  }

  return (
    <div className="p-4">
      <Button onClick={openDialog}>Clique</Button>
      {status ? 'SIM' : 'NAO'}
      <DialogContainer />
    </div>
  )
}
```

### API

- `dialog(element, options?)`
  - `element`: componente React que será renderizado dentro do diálogo
  - `options`: objeto com `title`, `data`, `size`, `position`
  - retorna `Promise<any>` que resolve quando o diálogo é fechado

- `useDialog()`
  - `close(data)`: fecha o diálogo e retorna `data` para quem chamou
  - `setTitle(title)`: atualiza o título do diálogo
  - `setSize(size)`: atualiza o tamanho do diálogo
  - `setPosition(position)`: atualiza a posição do diálogo
  - `options`: opções passadas originalmente para o diálogo

## Instalação

### Via Shadcn Registry

```bash
npx shadcn@latest add wargas/promise-dialog/promise-dialog
```

ou

```bash
bunx shadcn@latest add wargas/promise-dialog/promise-dialog
```

## Observações

- O `DialogContainer` deve estar presente no JSX para que os diálogos sejam renderizados.
- A implementação atual utiliza `Drawer` do `vaul`, mas pode ser adaptada para outros tipos de modais.
