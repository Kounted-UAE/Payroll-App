
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  

  return (
    <Sonner
      
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-500 group-[.toast]:text-zinc-500-foreground",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
