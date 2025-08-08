'use client'

import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modal: null,
  handleOpen: () => set({ isOpen: true }),
  handleClose: () => set({ isOpen: false }),
}))

export default useModalStore
