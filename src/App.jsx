import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Trash2, Plus, Search, PaintBucket } from 'lucide-react'

const STORAGE_KEY = 'prim-paint-inventory-v4'
const LAST_BRAND_KEY = 'prim-paint-inventory-last-brand'

const BRANDS = ['Sherwin-Williams', 'Benjamin Moore', 'Other']
const FINISHES = ['Flat', 'Satin', 'Eggshell', 'Semi-Gloss', 'Other']
const AMOUNTS = ['Sample', '1 Quart', '1/4 Gallon', '1/2 Gallon', '3/4 Gallon', 'Full Gallon', '5 Gallons', 'Other']

const BASE_FORM = {
  name: '',
  brand: 'Sherwin-Williams',
  product: '',
  finish: 'Eggshell',
  amount: '1/2 Gallon',
  area: 'interior',
  customBrand: '',
  customFinish: '',
  customAmount: '',
}

const initialItems = [
  { id: 1, name: 'Accessible Beige', brand: 'Sherwin-Williams', product: 'Duration Home', finish: 'Eggshell', amount: '1/2 Gallon', area: 'interior', createdAt: Date.now() - 4000 },
  { id: 2, name: 'Pure White', brand: 'Sherwin-Williams', product: 'Emerald Urethane Trim Enamel', finish: 'Semi-Gloss', amount: '1 Gallon', area: 'interior', createdAt: Date.now() - 3000 },
  { id: 3, name: 'Iron Ore', brand: 'Sherwin-Williams', product: 'Duration Exterior', finish: 'Satin', amount: '1 Quart', area: 'exterior', createdAt: Date.now() - 2000 },
  { id: 4, name: 'Alabaster', brand: 'Sherwin-Williams', product: 'SuperPaint Interior', finish: 'Flat', amount: 'Full Gallon', area: 'interior', createdAt: Date.now() - 1000 },
]

function OptionPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-11 rounded-full border px-4 py-2.5 text-[15px] font-medium leading-none transition-colors ${active ? 'border-black bg-black text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'}`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function PrimLogo() {
  return (
    <div className="flex items-center gap-0 text-[26px] sm:text-3xl font-black tracking-tight leading-none">
      <span className="text-black">prim</span>
      <span className="text-green-600">painting</span>
    </div>
  )
}

export default function PaintInventoryApp() {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(BASE_FORM)
  const [lastBrand, setLastBrand] = useState('Sherwin-Williams')
  const nameInputRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedLastBrand = localStorage.getItem(LAST_BRAND_KEY)

    if (savedLastBrand && BRANDS.includes(savedLastBrand)) {
      setLastBrand(savedLastBrand)
      setForm((prev) => ({ ...prev, brand: savedLastBrand, customBrand: savedLastBrand === 'Other' ? prev.customBrand : '' }))
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const normalized = Array.isArray(parsed)
          ? parsed.map((item, index) => ({
              id: item?.id ?? Date.now() + index,
              name: item?.name ?? '',
              brand: item?.brand ?? '—',
              product: item?.product ?? '',
              finish: item?.finish ?? '—',
              amount: item?.amount ?? '—',
              area: item?.area === 'exterior' ? 'exterior' : 'interior',
              createdAt: item?.createdAt ?? Date.now() + index,
            }))
          : initialItems
        setItems(normalized)
      } catch {
        setItems(initialItems)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem(LAST_BRAND_KEY, lastBrand)
  }, [lastBrand])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus?.()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = items.filter((item) => {
      const name = (item.name ?? '').toLowerCase()
      const brand = (item.brand ?? '').toLowerCase()
      const product = (item.product ?? '').toLowerCase()
      const finish = (item.finish ?? '').toLowerCase()
      const amount = (item.amount ?? '').toLowerCase()
      const matchesSearch = !q || name.includes(q) || brand.includes(q) || product.includes(q) || finish.includes(q) || amount.includes(q)
      const matchesFilter = filter === 'all' ? true : item.area === filter
      return matchesSearch && matchesFilter
    })

    return [...base].sort((a, b) => {
      const aName = (a.name ?? '').toLowerCase()
      const bName = (b.name ?? '').toLowerCase()
      const aStarts = q ? aName.startsWith(q) : false
      const bStarts = q ? bName.startsWith(q) : false
      if (aStarts !== bStarts) return aStarts ? -1 : 1
      return (b.createdAt ?? 0) - (a.createdAt ?? 0)
    })
  }, [items, search, filter])

  const counts = useMemo(
    () => ({
      interior: items.filter((i) => i.area === 'interior').length,
      exterior: items.filter((i) => i.area === 'exterior').length,
    }),
    [items],
  )

  function resetForm() {
    setForm({ ...BASE_FORM, brand: lastBrand })
  }

  function closeDialog() {
    resetForm()
    setEditingId(null)
    setOpen(false)
  }

  function handleSaveItem() {
    if (!form.name.trim()) return

    const resolvedBrand = form.brand === 'Other' ? form.customBrand.trim() || 'Other' : form.brand
    const resolvedProduct = form.product.trim() || ''
    const resolvedFinish = form.finish === 'Other' ? form.customFinish.trim() || 'Other' : form.finish
    const resolvedAmount = form.amount === 'Other' ? form.customAmount.trim() || 'Other' : form.amount

    setLastBrand(form.brand)

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                brand: resolvedBrand,
                product: resolvedProduct,
                finish: resolvedFinish,
                amount: resolvedAmount,
                area: form.area,
              }
            : item,
        ),
      )
    } else {
      const newItem = {
        id: Date.now(),
        name: form.name.trim(),
        brand: resolvedBrand,
        product: resolvedProduct,
        finish: resolvedFinish,
        amount: resolvedAmount,
        area: form.area,
        createdAt: Date.now(),
      }
      setItems((prev) => [newItem, ...prev])
    }

    closeDialog()
  }

  function editItem(item) {
    const knownBrand = BRANDS.includes(item.brand) ? item.brand : 'Other'
    const knownProduct = item.product === '—' ? '' : item.product
    const knownFinish = FINISHES.includes(item.finish) ? item.finish : 'Other'
    const knownAmount = AMOUNTS.includes(item.amount) ? item.amount : 'Other'

    setForm({
      name: item.name === '—' ? '' : item.name,
      brand: knownBrand,
      product: knownProduct,
      finish: knownFinish,
      amount: knownAmount,
      area: item.area,
      customBrand: knownBrand === 'Other' ? item.brand : '',
      customFinish: knownFinish === 'Other' ? item.finish : '',
      customAmount: knownAmount === 'Other' ? item.amount : '',
    })
    setEditingId(item.id)
    setOpen(true)
  }

  function handleImmediateEdit(patch) {
    if (editingId === null) {
      setForm((prev) => ({ ...prev, ...patch }))
      return
    }

    setForm((prev) => {
      const nextForm = { ...prev, ...patch }
      const resolvedBrand = nextForm.brand === 'Other' ? nextForm.customBrand.trim() || 'Other' : nextForm.brand
      const resolvedProduct = nextForm.product.trim() || ''
      const resolvedFinish = nextForm.finish === 'Other' ? nextForm.customFinish.trim() || 'Other' : nextForm.finish
      const resolvedAmount = nextForm.amount === 'Other' ? nextForm.customAmount.trim() || 'Other' : nextForm.amount

      setLastBrand(nextForm.brand)
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: nextForm.name.trim() || item.name,
                brand: resolvedBrand,
                product: resolvedProduct,
                finish: resolvedFinish,
                amount: resolvedAmount,
                area: nextForm.area,
              }
            : item,
        ),
      )

      return nextForm
    })
  }

  function handleDialogChange(nextOpen) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setEditingId(null)
      resetForm()
    }
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-2 py-2 sm:p-6">
      <div className="mx-auto max-w-5xl w-full">
        <Card className="rounded-[28px] border-0 shadow-xl overflow-hidden bg-transparent sm:bg-white">
          <div className="sticky top-0 z-20 border-b bg-neutral-100/95 px-2 py-3 backdrop-blur supports-[backdrop-filter]:bg-neutral-100/80 sm:bg-white sm:px-6 sm:py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <PrimLogo />
                <div>
                  <h1 className="text-lg font-bold tracking-tight sm:text-3xl">Paint Inventory</h1>
                  <p className="text-sm text-neutral-500">Leftover paint tracking for the shop.</p>
                </div>
              </div>

              <Dialog open={open} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button className="h-12 w-full rounded-2xl px-5 text-base shadow-sm sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Paint
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-lg overflow-y-auto rounded-3xl p-4 sm:w-[calc(100vw-1.5rem)] sm:p-6">
                  <DialogHeader>
                    <DialogTitle>{editingId !== null ? 'Edit Paint' : 'Add Paint'}</DialogTitle>
                  </DialogHeader>
                  <form
                    className="grid gap-4 pt-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveItem()
                    }}
                  >
                    <div className="grid gap-2">
                      <Label>Color Name</Label>
                      <Input ref={nameInputRef} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Pure White" className="h-12 rounded-xl text-base" />
                    </div>

                    <div className="grid gap-2">
                      <Label>Brand</Label>
                      <OptionPills options={BRANDS} value={form.brand} onChange={(value) => handleImmediateEdit({ brand: value })} />
                      {form.brand === 'Other' ? <Input value={form.customBrand} onChange={(e) => setForm({ ...form, customBrand: e.target.value })} placeholder="Enter brand" className="h-12 rounded-xl text-base" /> : null}
                    </div>

                    <div className="grid gap-2">
                      <Label>Product</Label>
                      <Input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="Ex: Duration Home" className="h-12 rounded-xl text-base" />
                    </div>

                    <div className="grid gap-2">
                      <Label>Finish</Label>
                      <OptionPills options={FINISHES} value={form.finish} onChange={(value) => handleImmediateEdit({ finish: value, customFinish: value === 'Other' ? form.customFinish : '' })} />
                      {form.finish === 'Other' ? <Input value={form.customFinish} onChange={(e) => setForm({ ...form, customFinish: e.target.value })} placeholder="Enter finish" className="h-12 rounded-xl text-base" /> : null}
                    </div>

                    <div className="grid gap-2">
                      <Label>Amount Left</Label>
                      <OptionPills options={AMOUNTS} value={form.amount} onChange={(value) => handleImmediateEdit({ amount: value, customAmount: value === 'Other' ? form.customAmount : '' })} />
                      {form.amount === 'Other' ? <Input value={form.customAmount} onChange={(e) => setForm({ ...form, customAmount: e.target.value })} placeholder="Enter amount" className="h-12 rounded-xl text-base" /> : null}
                    </div>

                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleImmediateEdit({ area: 'interior' })}
                          className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${form.area === 'interior' ? 'border-black bg-black text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'}`}
                        >
                          Interior
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImmediateEdit({ area: 'exterior' })}
                          className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${form.area === 'exterior' ? 'border-black bg-black text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200'}`}
                        >
                          Exterior
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="h-12 rounded-2xl text-base">
                      {editingId !== null ? 'Update Paint' : 'Save Paint'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <CardContent className="space-y-3 p-2 sm:space-y-4 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFilter((prev) => (prev === 'interior' ? 'all' : 'interior'))}
                className={`text-left rounded-2xl transition-all duration-200 active:scale-[0.99] ${filter === 'interior' ? 'bg-blue-50 shadow-md ring-2 ring-blue-400' : ''}`}
              >
                <Card className="rounded-2xl border-0 bg-white/95 shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-500 sm:text-xs">Interior</div>
                    <div className="text-xl font-bold sm:text-2xl">{counts.interior}</div>
                  </CardContent>
                </Card>
              </button>
              <button
                type="button"
                onClick={() => setFilter((prev) => (prev === 'exterior' ? 'all' : 'exterior'))}
                className={`text-left rounded-2xl transition-all duration-200 active:scale-[0.99] ${filter === 'exterior' ? 'bg-green-50 shadow-md ring-2 ring-green-400' : ''}`}
              >
                <Card className="rounded-2xl border-0 bg-white/95 shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <div className="text-[10px] uppercase tracking-wide text-neutral-500 sm:text-xs">Exterior</div>
                    <div className="text-xl font-bold sm:text-2xl">{counts.exterior}</div>
                  </CardContent>
                </Card>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search color, brand, product, finish..."
                className="h-12 rounded-2xl bg-white pl-9 text-base shadow-sm"
              />
            </div>

            <div className="grid gap-2.5 pb-3 sm:gap-3 sm:pb-0">
              {filteredItems.length === 0 ? (
                <Card className="rounded-3xl border-dashed bg-white shadow-sm">
                  <CardContent className="p-8 text-center sm:p-10">
                    <PaintBucket className="mx-auto mb-3 h-10 w-10 text-neutral-400" />
                    <div className="text-lg font-semibold">No paint found</div>
                    <p className="mt-1 text-sm text-neutral-500">Try changing the search or add your first can.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map((item) => (
                  <Card key={item.id} className="cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-md" onClick={() => editItem(item)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2 pr-2">
                              <h3 className="break-words text-base font-bold leading-tight sm:text-lg">{item.name}</h3>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.area === 'interior' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {item.area === 'interior' ? 'Interior' : 'Exterior'}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 shrink-0 rounded-2xl"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteItem(item.id)
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5 text-sm text-neutral-600 sm:grid-cols-2 lg:grid-cols-4 sm:gap-2">
                          <div><span className="font-medium text-neutral-900">Brand:</span> {item.brand}</div>
                          <div><span className="font-medium text-neutral-900">Product:</span> {item.product}</div>
                          <div><span className="font-medium text-neutral-900">Finish:</span> {item.finish}</div>
                          <div><span className="font-medium text-neutral-900">Amount:</span> {item.amount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
