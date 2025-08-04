'use client'

import useModalStore from '@stores/useModalStore'
import { Modal } from 'antd'
import React from 'react'

function useModal() {
  const { handleClose, handleOpen, isOpen, setModal } = useModalStore()

  const hideDialog = () => {
    handleClose()
  }

  const showDialog = (props: React.ReactNode) => {
    handleOpen()
    setModal(
      <Modal open={isOpen} onCancel={hideDialog}>
        {props}
      </Modal>,
    )
  }

  return { showDialog, hideDialog }
}

export default useModal
