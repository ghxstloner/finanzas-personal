"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getCurrencySelectOptions, getCurrency } from "@/lib/currencies"

interface CurrencySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function CurrencySelect({
  value,
  onValueChange,
  placeholder = "Seleccionar divisa...",
  disabled = false,
}: CurrencySelectProps) {
  const [open, setOpen] = React.useState(false)
  const currencyOptions = getCurrencySelectOptions()
  
  const selectedCurrency = value ? getCurrency(value) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCurrency ? (
            <span className="flex items-center gap-2">
              <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
                {selectedCurrency.symbol}
              </span>
              {selectedCurrency.name} ({selectedCurrency.code})
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar divisa..." />
          <CommandList>
            <CommandEmpty>No se encontró la divisa.</CommandEmpty>
            <CommandGroup>
              {currencyOptions.map((option) => {
                const currency = getCurrency(option.value)!
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${currency.symbol}`}
                    onSelect={() => {
                      onValueChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
                          {currency.symbol}
                        </span>
                        <span>{currency.name}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {currency.code}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}