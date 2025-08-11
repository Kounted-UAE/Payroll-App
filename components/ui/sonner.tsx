
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
          description: "group-[.toast]:text-blue-200",
          actionButton:
            "group-[.toast]:bg-blue-500 group-[.toast]:text-blue-500-foreground",
          cancelButton:
            "group-[.toast]:bg-blue-100 group-[.toast]:text-blue-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
