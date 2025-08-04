'use client'

import type React from 'react'
import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  modal: React.ReactNode
  setModal: (modal: React.ReactNode) => void
  handleOpen: () => void
  handleClose: () => void
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modal: null,
  setModal: (modal) => set({ modal }),
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}))

export default useModalStore
