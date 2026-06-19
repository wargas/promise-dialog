import EventEmitter from "eventemitter3"
import { createContext, useContext, useEffect, useState, type JSX } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../../components/ui/drawer"
import { uniqueId } from "lodash"

export type DialogSizes = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type DialogPositions = 'left' | 'right' | 'center'
export type DialogOptions = {
    data?: any
    title?: string
    size?: DialogSizes
    position?: DialogPositions
}

export type DialogItemProps = {
    element: () => JSX.Element,
    options: DialogOptions
    id: string
}

export const EventManager = new EventEmitter()

export function DialogContainer() {

    const [dialogs, setDialog] = useState<DialogItemProps[]>([])

    useEffect(() => {
        EventManager.on('add-modal', (element: () => JSX.Element, options: DialogOptions, id: string) => {
            setDialog(olds => [...olds, { element, options, id }])
        })

        EventManager.on('remove-modal', (id: string) => {
            setDialog(olds => olds.filter(m => m.id != id))
        })

        EventManager.on('close-modal', (id: string, data: any) => {
            EventManager.emit(`close-modal:${id}`, data)
        })

        EventManager.on('set-title', function (id: string, title: string) {
            setDialog(olds => {
                return olds.map(m => {
                    if (m.id == id) {
                        m.options.title = title
                    }
                    return m;
                })
            })
        })

        EventManager.on('set-size', function (id: string, size: DialogSizes) {
            setDialog(olds => {
                return olds.map(m => {
                    if (m.id == id) {
                        m.options.size = size
                    }
                    return m;
                })
            })
        })

        EventManager.on('set-position', function (id: string, position: DialogPositions) {
            setDialog(olds => {
                return olds.map(m => {
                    if (m.id == id) {
                        m.options.position = position
                    }
                    return m;
                })
            })
        })

        return () => {
            EventManager.off('add-modal')
            EventManager.off('close-modal')
            EventManager.off('remove-modal')
        }
    }, [])

    return <div>
        {dialogs.map(({ id, element: Element, options }) => (
            <DialogProvider options={options} id={id} key={id}>
                <Element />
            </DialogProvider>
        ))}
    </div>
}

function dialog(element: () => JSX.Element, options?: DialogOptions) {
    return new Promise(accept => {
        const id = uniqueId('modal_')
        EventManager.emit('add-modal', element, options || {}, id)

        EventManager.on(`close-modal:${id}`, accept)
    })
}

export function useDialog() {
    const ctx = useContext(DialogContext);

    function close(data: any) {
        EventManager.emit(`close-modal`, ctx.id, data)
    }

    function setTitle(title: string) {
        EventManager.emit(`set-title`, ctx.id, title)
    }

    function setSize(size: DialogSizes) {
        EventManager.emit(`set-size`, ctx.id, size)
    }

    function setPosition(position: DialogPositions) {
        EventManager.emit('set-position', ctx.id, position)
    }

    return { close, setTitle, setSize, setPosition, options: ctx.options }
}

export const DialogContext = createContext(
    {} as Omit<DialogItemProps, "element">
);

type Props = { children: any } & Omit<DialogItemProps, "element">;
export function DialogProvider({ children, options, id }: Props) {
    const [show, setShow] = useState(false);

    function close() {
        removeModal()
        EventManager.emit(`close-modal`, id, null);
    }

    useEffect(() => {
        setShow(true);

        EventManager.on(`close-modal:${id}`, function () {
            setShow(false);
        });

        return () => {
            EventManager.off(`show-modal:${id}`);
            EventManager.off(`hide-modal:${id}`);
        };
    }, [id]);

    function removeModal(): void {
        EventManager.emit("remove-modal", id);
    }

    return (
        <DialogContext.Provider value={{ options, id }}>
            <Drawer direction="right" open={show} onOpenChange={ev => !ev ? close() : null}>
                <DrawerContent>
                    <DrawerHeader className="border-b">
                        <DrawerTitle>
                            {options.title}
                        </DrawerTitle>
                    </DrawerHeader>

                    {children}
                </DrawerContent>
            </Drawer>
        </DialogContext.Provider>
    );
}


export { dialog }